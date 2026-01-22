import { Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function VerifyEmail() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Verifikasi Email Anda</h1>
        <p className="text-gray-600 mb-6">
          Kami telah mengirimkan email verifikasi ke alamat email Anda. 
          Silakan cek inbox atau folder spam Anda dan klik link verifikasi.
        </p>
        <Link to="/login" className="btn btn-primary">
          Kembali ke Login
        </Link>
      </div>
    </div>
  );
}
