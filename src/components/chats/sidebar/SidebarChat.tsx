'use client'

import { Plus, Search, X } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button/Button'
import Field from '@/components/ui/field/Field'

import { ChatModal } from '../ChatModal'

import { ListCardsChats } from './ListCardsChats'
import { useDebounced } from '@/hooks/useDebounced'
import { useSelectedChat } from '@/store/useSelectedChat'
import { useGlobalChatSearch } from '@/hooks/chat/useGlobalChatSearch'

export function SidebarChat() {
	const [isModalOpen, setModalOpen] = useState(false)
	const [search, setSearch] = useState('')
	const debounced = useDebounced(search, 300)
  const selectChat = useSelectedChat(s => s.selectChat)
  const hasQuery = debounced.trim().length > 0

	const { data, isFetching } = useGlobalChatSearch(debounced)

	return (
		<aside className='h-full bg-white border-r-2 border-slate-200 overflow-hidden p-3'>
			<div className='mt-3'>
				<Field
					placeholder='Поиск...'
					value={search}
					onChange={e => setSearch(e.target.value)}
					leftIcon={Search}
					rightIcon={X}
					onRightIconClick={() => setSearch('')}
				/>
			</div>
			<Button
				className='mt-3 w-full h-10 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 flex items-center justify-center rounded-lg'
				onClick={() => setModalOpen(true)}
			>
				<Plus
					className='mr-2'
					size={18}
				/>
				<span className='text-sm'>Создать новый чат</span>
			</Button>
			{/* Без запроса — обычный список */}
      {!hasQuery && <ListCardsChats search={search} />}

      {/* С запросом — результаты глобального поиска */}
      {hasQuery && (
        <div className='mt-3 overflow-auto space-y-3'>
          <div>
            <p className='px-1 text-xs text-slate-500 mb-1'>
              Чаты {isFetching && '…'}
            </p>
            <div className='space-y-1'>
              {(data?.chats ?? []).map(c => (
                <button
                  key={c.id}
                  className='w-full text-left px-3 py-2 rounded hover:bg-slate-100'
                  onClick={() => selectChat(String(c.id))}
                >
                  <div className='font-medium'>{c.title}</div>
                  {c.last_message && (
                    <div className='text-xs text-slate-500 truncate'>
                      {c.last_message}
                    </div>
                  )}
                </button>
              ))}
              {!data?.chats?.length && (
                <div className='px-3 py-2 text-sm text-slate-500'>Нет совпадений</div>
              )}
            </div>
          </div>

          <div>
            <p className='px-1 text-xs text-slate-500 mb-1'>
              Сообщения {isFetching && '…'}
            </p>
            <div className='space-y-1'>
              {(data?.messages ?? []).map(m => (
                <button
                  key={m.id}
                  className='w-full text-left px-3 py-2 rounded hover:bg-slate-100'
                  onClick={() => {
                    selectChat(String(m.chat_id))
                    window.dispatchEvent(new CustomEvent('chat:scrollToMessage', {
                      detail: { messageId: m.id }
                    }))
                  }}
                >
                  <div className='text-sm truncate'>{m.content}</div>
                  <div className='text-[11px] text-slate-500'>В чате #{m.chat_id}</div>
                </button>
              ))}
              {!data?.messages?.length && (
                <div className='px-3 py-2 text-sm text-slate-500'>Нет совпадений</div>
              )}
            </div>
          </div>
        </div>
      )}
			<ChatModal
				isOpen={isModalOpen}
				onClose={() => setModalOpen(false)}
			/>
		</aside>
	)
}
