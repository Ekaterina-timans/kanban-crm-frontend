export interface TimezoneOption {
	value: string
	label: string
}

export const TIMEZONE_OPTIONS: TimezoneOption[] = [
	// Россия
	{ value: 'Europe/Kaliningrad', label: 'Калининград (GMT+2)' },
	{ value: 'Europe/Moscow', label: 'Москва (GMT+3)' },
	{ value: 'Europe/Samara', label: 'Самара (GMT+4)' },
	{ value: 'Asia/Yekaterinburg', label: 'Екатеринбург (GMT+5)' },
	{ value: 'Asia/Omsk', label: 'Омск (GMT+6)' },
	{ value: 'Asia/Novosibirsk', label: 'Новосибирск (GMT+7)' },
	{ value: 'Asia/Krasnoyarsk', label: 'Красноярск (GMT+7)' },
	{ value: 'Asia/Irkutsk', label: 'Иркутск (GMT+8)' },
	{ value: 'Asia/Yakutsk', label: 'Якутск (GMT+9)' },
	{ value: 'Asia/Vladivostok', label: 'Владивосток (GMT+10)' },
	{ value: 'Asia/Magadan', label: 'Магадан (GMT+11)' },
	{ value: 'Asia/Kamchatka', label: 'Петропавловск-Камчатский (GMT+12)' },

	// Европа
	{ value: 'Europe/Berlin', label: 'Берлин (GMT+1)' },
	{ value: 'Europe/Paris', label: 'Париж (GMT+1)' },
	{ value: 'Europe/London', label: 'Лондон (GMT+0)' },
	{ value: 'Europe/Warsaw', label: 'Варшава (GMT+1)' },
	{ value: 'Europe/Istanbul', label: 'Стамбул (GMT+3)' },

	// Азия
	{ value: 'Asia/Dubai', label: 'Дубай (GMT+4)' },
	{ value: 'Asia/Tashkent', label: 'Ташкент (GMT+5)' },
	{ value: 'Asia/Almaty', label: 'Алма-Ата (GMT+6)' },
	{ value: 'Asia/Bangkok', label: 'Бангкок (GMT+7)' },
	{ value: 'Asia/Hong_Kong', label: 'Гонконг (GMT+8)' },
	{ value: 'Asia/Tokyo', label: 'Токио (GMT+9)' },
	{ value: 'Asia/Seoul', label: 'Сеул (GMT+9)' },
	{ value: 'Asia/Singapore', label: 'Сингапур (GMT+8)' },

	// Америка
	{ value: 'America/Sao_Paulo', label: 'Сан-Паулу (GMT-3)' },
	{ value: 'America/New_York', label: 'Нью-Йорк (GMT-5)' },
	{ value: 'America/Chicago', label: 'Чикаго (GMT-6)' },
	{ value: 'America/Denver', label: 'Денвер (GMT-7)' },
	{ value: 'America/Los_Angeles', label: 'Лос-Анджелес (GMT-8)' },

	// Прочие
	{ value: 'Australia/Sydney', label: 'Сидней (GMT+10)' },
	{ value: 'Pacific/Auckland', label: 'Окленд (GMT+12)' }
]
