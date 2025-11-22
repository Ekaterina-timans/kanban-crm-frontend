import { IColumn } from "@/types/column.types";

export function ColumnPosition({ column }: { column: IColumn }) {

  return (
    <div 
      className='w-96 h-12 rounded-md flex items-center justify-between px-2 border mb-5'
      style={{ backgroundColor: column.color }}
    >
      <span className='text-white text-[19px] font-medium'>{column.name}</span>
    </div>
  )
}