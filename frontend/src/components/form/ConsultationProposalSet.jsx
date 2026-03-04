// Styled from Figma MCP output - exact spacing and colors

export default function ConsultationProposalSet({ data, onChange }) {
  return (
    <div className="bg-white border border-[#eef0ef] border-solid flex flex-wrap gap-[30px] items-start px-[15px] py-[30px] rounded-[15px] shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)] w-full">
      <p className="font-bold leading-normal text-[#161616] text-[18px] w-full" style={{ fontFamily: 'Avenir, sans-serif' }}>
        Consultation Proposal Set
      </p>

      {/* Customer Name */}
      <div className="flex flex-col gap-[5px] items-start w-[450px]">
        <p className="font-bold leading-normal text-[#666] text-[12px] uppercase" style={{ fontFamily: 'Avenir, sans-serif' }}>
          Customer Name:
        </p>
        <input
          type="text"
          value={data.customerName}
          onChange={(e) => onChange('customerName', e.target.value)}
          className="border border-[rgba(204,204,204,0.93)] h-[45px] rounded-[5px] w-full px-[17px] text-[12px] text-[#666] uppercase"
          style={{ fontFamily: 'Avenir, sans-serif' }}
        />
      </div>

      {/* Proposal Name */}
      <div className="flex flex-col gap-[5px] items-start w-[450px]">
        <p className="font-bold leading-normal text-[#666] text-[12px] uppercase" style={{ fontFamily: 'Avenir, sans-serif' }}>
          Proposal Name:
        </p>
        <div className="border border-[#ccc] flex items-center px-[17px] py-[15px] rounded-[5px] w-full">
          <input
            type="text"
            value={data.proposalName}
            onChange={(e) => onChange('proposalName', e.target.value)}
            placeholder="Josh & Amandas - March 26"
            className="text-[#666] text-[12px] uppercase w-full bg-transparent outline-none"
            style={{ fontFamily: 'Avenir, sans-serif' }}
          />
        </div>
      </div>

      {/* Consultation Level */}
      <div className="flex flex-col gap-[5px] items-start w-[450px]">
        <p className="font-bold leading-normal text-[#666] text-[12px] uppercase" style={{ fontFamily: 'Avenir, sans-serif' }}>
          Consultation Level:
        </p>
        <div className="border border-[#ccc] flex items-center p-[15px] w-full relative">
          <select
            value={data.consultationLevel}
            onChange={(e) => onChange('consultationLevel', e.target.value)}
            className="text-[#666] text-[14px] w-full bg-transparent outline-none appearance-none cursor-pointer"
            style={{ fontFamily: 'Avenir, sans-serif' }}
          >
            <option>Basic Consultation</option>
            <option>Professional Consultation</option>
          </select>
          <div className="absolute right-[15px] pointer-events-none">
            <svg width="10" height="10" viewBox="0 0 10 10" className="rotate-180">
              <polygon points="5,0 10,7.5 0,7.5" fill="#666"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Event Name */}
      <div className="flex flex-col gap-[5px] items-start w-[450px]">
        <p className="font-bold leading-normal text-[#666] text-[12px] uppercase" style={{ fontFamily: 'Avenir, sans-serif' }}>
          Event Name:
        </p>
        <div className="border border-[#ccc] flex items-center px-[17px] py-[15px] rounded-[5px] w-full">
          <input
            type="text"
            value={data.eventName}
            onChange={(e) => onChange('eventName', e.target.value)}
            placeholder="Josh & Amandas Wedding Flowers"
            className="text-[#666] text-[12px] uppercase w-full bg-transparent outline-none"
            style={{ fontFamily: 'Avenir, sans-serif' }}
          />
        </div>
      </div>

      {/* Proposal Template */}
      <div className="flex flex-col gap-[5px] items-start w-[450px]">
        <p className="font-bold leading-normal text-[#666] text-[12px] uppercase" style={{ fontFamily: 'Avenir, sans-serif' }}>
          Proposal Template:
        </p>
        <div className="border border-[#ccc] flex items-center p-[15px] w-full relative">
          <select
            value={data.proposalTemplate}
            onChange={(e) => onChange('proposalTemplate', e.target.value)}
            className="text-[#666] text-[14px] w-full bg-transparent outline-none appearance-none cursor-pointer"
            style={{ fontFamily: 'Avenir, sans-serif' }}
          >
            <option>Modern Wedding Consultation</option>
            <option>Classic Wedding Consultation</option>
            <option>Baby Shower Consultation</option>
            <option>Quinceañera Consultation</option>
          </select>
          <div className="absolute right-[15px] pointer-events-none">
            <svg width="10" height="10" viewBox="0 0 10 10" className="rotate-180">
              <polygon points="5,0 10,7.5 0,7.5" fill="#666"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Event Date */}
      <div className="flex flex-col gap-[5px] items-start w-[450px]">
        <p className="font-bold leading-normal text-[#666] text-[12px] uppercase" style={{ fontFamily: 'Avenir, sans-serif' }}>
          Event Date:
        </p>
        <div className="border border-[#ccc] flex items-center justify-between px-[10px] py-[12px] w-full">
          <input
            type="date"
            value={data.eventDate}
            onChange={(e) => onChange('eventDate', e.target.value)}
            className="text-[#666] text-[12px] uppercase flex-1 bg-transparent outline-none"
            style={{ fontFamily: 'Avenir, sans-serif' }}
          />
        </div>
      </div>

      {/* Delivery Date */}
      <div className="flex flex-col gap-[5px] items-start w-[450px]">
        <p className="font-bold leading-normal text-[#666] text-[12px] uppercase" style={{ fontFamily: 'Avenir, sans-serif' }}>
          Delivery Date:
        </p>
        <div className="border border-[#ccc] flex items-center justify-between px-[10px] py-[12px] w-full">
          <input
            type="date"
            value={data.deliveryDate}
            onChange={(e) => onChange('deliveryDate', e.target.value)}
            className="text-[#666] text-[12px] uppercase flex-1 bg-transparent outline-none"
            style={{ fontFamily: 'Avenir, sans-serif' }}
          />
        </div>
      </div>
    </div>
  );
}
