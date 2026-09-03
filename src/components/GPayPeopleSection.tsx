import React from 'react';
import { UserPlus, ShieldCheck, Check } from 'lucide-react';
import { Payee } from '../types';

interface GPayPeopleSectionProps {
  contacts: Payee[];
  onSelectContact: (contact: Payee) => void;
  onPayNewContact: () => void;
}

export const GPayPeopleSection: React.FC<GPayPeopleSectionProps> = ({
  contacts,
  onSelectContact,
  onPayNewContact,
}) => {
  return (
    <div id="section-gpay-people" className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-slate-900 tracking-tight">People</h3>
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            {contacts.length} Default Contacts
          </span>
        </div>
        <button
          type="button"
          onClick={onPayNewContact}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
        >
          + Pay new person
        </button>
      </div>

      {/* Grid of Google Pay circular contacts */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="grid grid-cols-4 sm:grid-cols-4 gap-3 sm:gap-4">
          {contacts.map((contact) => (
            <button
              key={contact.id}
              id={`contact-${contact.id}`}
              type="button"
              onClick={() => onSelectContact(contact)}
              className="flex flex-col items-center text-center group cursor-pointer p-1 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <div className="relative mb-1.5">
                <div
                  className={`w-14 h-14 rounded-full ${
                    contact.avatarBg || 'bg-blue-600'
                  } ${
                    contact.avatarColor || 'text-white'
                  } font-bold text-base flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform ring-2 ring-slate-100`}
                >
                  {contact.avatarInitials || contact.name.slice(0, 2).toUpperCase()}
                </div>
                {/* Verified Shield Badge on default contacts */}
                <div
                  title="Default Account Contact (No wait needed)"
                  className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] ring-2 ring-white"
                >
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              </div>

              <span className="text-xs font-semibold text-slate-800 leading-tight line-clamp-2 max-w-[76px]">
                {contact.name}
              </span>
            </button>
          ))}

          {/* "+ New" Contact Button (Will trigger New Contact popup + 10-15s hold) */}
          <button
            id="btn-add-new-contact"
            type="button"
            onClick={onPayNewContact}
            className="flex flex-col items-center text-center group cursor-pointer p-1 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <div className="w-14 h-14 rounded-full bg-blue-50 border-2 border-dashed border-blue-400 text-blue-600 flex items-center justify-center mb-1.5 group-hover:scale-105 group-hover:bg-blue-100 transition-all shadow-xs">
              <UserPlus className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-blue-700 leading-tight">
              + New Person
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
