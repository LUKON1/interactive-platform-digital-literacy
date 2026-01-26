import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";

export const Footer = () => {
	const location = useLocation();
	const year = useMemo(() => new Date().getFullYear(), []);

	// Don't show footer inside a lesson
	if (location.pathname.includes("/lesson/")) return null;

	return (
		<footer className="border-t border-[var(--color-bg-surface-3)] bg-[var(--color-bg-surface-1)] py-12 mt-auto">
			<div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
				<div className="col-span-1 md:col-span-2">
					<h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-4">Cyber Academy</h3>
					<p className="text-[var(--color-text-secondary)] text-sm max-w-sm leading-relaxed">
						Образовательная платформа для повышения цифровой грамотности школьников. Мы делаем
						интернет безопаснее, один урок за раз.
					</p>
				</div>

				<div>
					<h4 className="text-sm font-bold text-[var(--color-text-primary)] mb-4 uppercase tracking-wider">
						Платформа
					</h4>
					<ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
						<li>
							<a href="#" className="hover:text-[var(--color-primary)] transition-colors">
								Все курсы
							</a>
						</li>
						<li>
							<a href="#" className="hover:text-[var(--color-primary)] transition-colors">
								Рейтинг
							</a>
						</li>
						<li>
							<a href="#" className="hover:text-[var(--color-primary)] transition-colors">
								Для учителей
							</a>
						</li>
					</ul>
				</div>

				<div>
					<h4 className="text-sm font-bold text-[var(--color-text-primary)] mb-4 uppercase tracking-wider">
						Контакты
					</h4>
					<ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
						<li>support@cyberacademy.ru</li>
						<li>+7 (999) 000-00-00</li>
						<li>Москва, Россия</li>
					</ul>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-[var(--color-bg-surface-3)] flex flex-col md:flex-row justify-between items-center text-sm text-[var(--color-text-muted)]">
				<p>© {year} Cyber Academy. Все права защищены.</p>
				<div className="flex gap-6 mt-4 md:mt-0">
					<a href="#" className="hover:text-[var(--color-text-primary)]">
						Политика конфиденциальности
					</a>
					<a href="#" className="hover:text-[var(--color-text-primary)]">
						Условия использования
					</a>
				</div>
			</div>
		</footer>
	);
};
