import { toast } from 'react-hot-toast';
import { CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react';

const base = (content: React.ReactNode) =>
  toast.custom(
    (t) => (
      <div className={`px-4 py-2 bg-white border border-[#ddd] shadow-xl rounded text-sm text-gray-700 flex items-center gap-2 ${t.visible ? 'animate-in fade-in slide-in-from-right duration-300' : 'animate-out fade-out slide-out-to-right duration-200'}`}>
        {content}
      </div>
    ),
    { duration: 2500 }
  );

export const toastSuccess = (message: string) =>
  base(
    <>
      <CheckCircle2 size={16} className="text-green-600" />
      <span className="font-medium text-[#004A99]">{message}</span>
    </>
  );

export const toastError = (message: string) =>
  base(
    <>
      <AlertCircle size={16} className="text-red-600" />
      <span className="font-medium text-[#004A99]">{message}</span>
    </>
  );

export const toastWarning = (message: string) =>
  base(
    <>
      <AlertTriangle size={16} className="text-amber-600" />
      <span className="font-medium text-[#004A99]">{message}</span>
    </>
  );

export const toastInfo = (message: string) =>
  base(
    <>
      <Info size={16} className="text-blue-600" />
      <span className="font-medium text-[#004A99]">{message}</span>
    </>
  );
