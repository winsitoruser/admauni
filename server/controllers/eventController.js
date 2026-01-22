import { Event, EventRegistration, User } from '../models/index.js';
import { Op } from 'sequelize';
import { sendEventReminderEmail } from '../utils/email.js';

export const getEvents = async (req, res, next) => {
  try {
    const { category, eventType, upcoming, page = 1, limit = 20 } = req.query;

    const where = { isPublished: true };
    if (category) where.category = category;
    if (eventType) where.eventType = eventType;
    if (upcoming) {
      where.startDate = { [Op.gte]: new Date() };
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Event.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'organizer',
        attributes: ['id', 'fullName']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['startDate', 'ASC']]
    });

    res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const event = await Event.findByPk(id, {
      include: [
        {
          model: User,
          as: 'organizer',
          attributes: ['id', 'fullName']
        },
        {
          model: EventRegistration,
          as: 'registrations',
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'fullName']
          }]
        }
      ]
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    next(error);
  }
};

export const createEvent = async (req, res, next) => {
  try {
    const event = await Event.create({
      ...req.body,
      organizerId: req.user.id
    });

    res.status(201).json({
      success: true,
      data: event
    });
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const event = await Event.findByPk(id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.organizerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await event.update(req.body);

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const event = await Event.findByPk(id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.organizerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await event.destroy();

    res.status(200).json({
      success: true,
      message: 'Event deleted'
    });
  } catch (error) {
    next(error);
  }
};

export const registerForEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findByPk(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (!event.isPublished) {
      return res.status(400).json({ message: 'Event is not published' });
    }

    if (event.registrationDeadline && new Date() > event.registrationDeadline) {
      return res.status(400).json({ message: 'Registration deadline has passed' });
    }

    const existingRegistration = await EventRegistration.findOne({
      where: { eventId, userId: req.user.id }
    });

    if (existingRegistration) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    if (event.maxParticipants) {
      const registrationCount = await EventRegistration.count({
        where: { eventId, status: { [Op.in]: ['approved', 'attended'] } }
      });

      if (registrationCount >= event.maxParticipants) {
        return res.status(400).json({ message: 'Event is full' });
      }
    }

    const registration = await EventRegistration.create({
      eventId,
      userId: req.user.id,
      status: event.requiresApproval ? 'pending' : 'approved',
      notes: req.body.notes
    });

    res.status(201).json({
      success: true,
      data: registration
    });
  } catch (error) {
    next(error);
  }
};

export const updateRegistrationStatus = async (req, res, next) => {
  try {
    const { registrationId } = req.params;
    const { status } = req.body;

    const registration = await EventRegistration.findByPk(registrationId, {
      include: [{ model: Event, as: 'event' }]
    });

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    if (registration.event.organizerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    registration.status = status;
    if (status === 'attended') {
      registration.attendedAt = new Date();
    }
    await registration.save();

    res.status(200).json({
      success: true,
      data: registration
    });
  } catch (error) {
    next(error);
  }
};

export const cancelRegistration = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    const registration = await EventRegistration.findOne({
      where: { eventId, userId: req.user.id }
    });

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    registration.status = 'cancelled';
    await registration.save();

    res.status(200).json({
      success: true,
      message: 'Registration cancelled'
    });
  } catch (error) {
    next(error);
  }
};

export const getMyEvents = async (req, res, next) => {
  try {
    const registrations = await EventRegistration.findAll({
      where: { userId: req.user.id },
      include: [{
        model: Event,
        as: 'event',
        include: [{
          model: User,
          as: 'organizer',
          attributes: ['id', 'fullName']
        }]
      }],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: registrations
    });
  } catch (error) {
    next(error);
  }
};

export const sendEventReminders = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findByPk(eventId, {
      include: [{
        model: EventRegistration,
        as: 'registrations',
        where: { status: { [Op.in]: ['approved', 'pending'] } },
        include: [{
          model: User,
          as: 'user'
        }]
      }]
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.organizerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    for (const registration of event.registrations) {
      await sendEventReminderEmail(registration.user, event);
    }

    res.status(200).json({
      success: true,
      message: `Reminders sent to ${event.registrations.length} participants`
    });
  } catch (error) {
    next(error);
  }
};
