import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { authAPI } from '../../services/api';
import { UserPlus } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');
      await authAPI.register(data);
      navigate('/verify-email', { state: { email: data.email } });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Daftar Alumni</h1>
          <p className="text-gray-600 mt-2">Bergabung dengan komunitas alumni ADMA</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Lengkap *
              </label>
              <input
                type="text"
                {...register('fullName', { required: 'Nama lengkap wajib diisi' })}
                className="input"
                placeholder="John Doe"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                NIM *
              </label>
              <input
                type="text"
                {...register('nim', { required: 'NIM wajib diisi' })}
                className="input"
                placeholder="123456789"
              />
              {errors.nim && (
                <p className="text-red-500 text-sm mt-1">{errors.nim.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              {...register('email', { required: 'Email wajib diisi' })}
              className="input"
              placeholder="alumni@admauni.ac.id"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fakultas *
              </label>
              <select {...register('faculty', { required: 'Fakultas wajib dipilih' })} className="input">
                <option value="">Pilih Fakultas</option>
                <option value="Teknik">Teknik</option>
                <option value="Ekonomi">Ekonomi</option>
                <option value="Hukum">Hukum</option>
                <option value="FISIP">FISIP</option>
              </select>
              {errors.faculty && (
                <p className="text-red-500 text-sm mt-1">{errors.faculty.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jurusan *
              </label>
              <input
                type="text"
                {...register('major', { required: 'Jurusan wajib diisi' })}
                className="input"
                placeholder="Teknik Informatika"
              />
              {errors.major && (
                <p className="text-red-500 text-sm mt-1">{errors.major.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tahun Lulus *
            </label>
            <input
              type="number"
              {...register('graduationYear', { 
                required: 'Tahun lulus wajib diisi',
                min: { value: 1980, message: 'Tahun tidak valid' },
                max: { value: new Date().getFullYear(), message: 'Tahun tidak valid' }
              })}
              className="input"
              placeholder="2023"
            />
            {errors.graduationYear && (
              <p className="text-red-500 text-sm mt-1">{errors.graduationYear.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <input
                type="password"
                {...register('password', { 
                  required: 'Password wajib diisi',
                  minLength: { value: 6, message: 'Password minimal 6 karakter' }
                })}
                className="input"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Konfirmasi Password *
              </label>
              <input
                type="password"
                {...register('confirmPassword', {
                  required: 'Konfirmasi password wajib diisi',
                  validate: value => value === watch('password') || 'Password tidak cocok'
                })}
                className="input"
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn btn-primary py-3 text-lg"
          >
            {loading ? 'Memproses...' : 'Daftar'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
