import React from 'react';

const InputField = ({ label, icon: Icon, ...props }) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
        {label}
      </label>
      <div className="relative">

        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Icon size={16} />
          </div>
        )}
        <input 
          {...props}
          className={`w-full ${Icon ? 'pl-10' : 'px-4'} pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-medium`}
        />
      </div>
    </div>
  );
};

export default InputField;