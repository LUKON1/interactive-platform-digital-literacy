import React, { useState } from "react";
import {
	DndContext,
	useDraggable,
	useDroppable,
	DragOverlay,
	defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import { motion, AnimatePresence } from "motion/react";
import { Check, X } from "lucide-react";

/* --- Draggable Item --- */
const DraggableItem = ({ id, content, isOverlay = false }) => {
	const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id });

	return (
		<div
			ref={setNodeRef}
			{...listeners}
			{...attributes}
			className={`
        bg-[var(--color-bg-surface-2)] border border-[var(--color-bg-surface-3)] 
        px-6 py-4 rounded-xl cursor-grab active:cursor-grabbing shadow-lg
        text-[var(--color-text-primary)] font-medium text-lg
        ${isOverlay ? "scale-105 border-[var(--color-primary)]" : ""}
        ${isDragging ? "opacity-30" : "opacity-100 h-20"} 
        flex items-center justify-center transition-colors hover:border-[var(--color-primary)]/50
      `}
			style={{
				touchAction: "none",
			}}>
			{content}
		</div>
	);
};

/* --- Droppable Bucket --- */
const DroppableBucket = ({ id, title, icon: Icon, color, items = [] }) => {
	const { setNodeRef, isOver } = useDroppable({ id });

	return (
		<div
			ref={setNodeRef}
			className={`
        flex-1 min-h-[300px] rounded-3xl border-2 transition-all p-4 flex flex-col items-center
        ${
					isOver
						? `bg-[var(--color-bg-surface-2)] border-[var(--color-${color})] scale-[1.02]`
						: "bg-[var(--color-bg-surface-1)] border-[var(--color-bg-surface-3)]"
				}
      `}>
			<div
				className={`mb-4 p-3 rounded-full bg-[var(--color-bg-surface-2)] text-[var(--color-${color})]`}>
				{Icon && <Icon size={32} />}
			</div>
			<h3 className={`text-xl font-bold mb-6 text-[var(--color-${color})]`}>{title}</h3>

			<div className="w-full space-y-3">
				{items.map((item) => (
					<motion.div
						key={item.id}
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						className={`p-3 rounded-lg border text-center text-[var(--color-text-secondary)] border-[var(--color-${color})]/30 bg-[var(--color-${color})]/5`}>
						{item.content}
					</motion.div>
				))}
			</div>

			{items.length === 0 && !isOver && (
				<div className="mt-10 text-[var(--color-text-muted)] text-sm border-2 border-dashed border-[var(--color-bg-surface-3)] p-6 rounded-xl w-full text-center">
					Перетащи сюда
				</div>
			)}
		</div>
	);
};

/* --- Main Component --- */
export const TermSorter = ({ onComplete, data, labels }) => {
	// Config (would come from props typically)
	const [items, setItems] = useState(
		data || [
			{ id: "1", content: "123456", category: "unsafe" },
			{ id: "2", content: "P@sw0rd!", category: "unsafe" }, // common pattern
			{ id: "3", content: "Tr0ub4dor&3", category: "safe" },
			{ id: "4", content: "MyNameIsLukon", category: "unsafe" },
			{ id: "5", content: "X7#m_9$pL2", category: "safe" },
		],
	);

	const bucketTitleSafe = labels?.safe || "Сильный Пароль";
	const bucketTitleUnsafe = labels?.unsafe || "Слабый Пароль";

	const [buckets, setBuckets] = useState({
		safe: [],
		unsafe: [],
	});

	const [activeId, setActiveId] = useState(null);
	const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'

	const handleDragStart = (event) => {
		setActiveId(event.active.id);
		setFeedback(null);
	};

	const handleDragEnd = (event) => {
		const { active, over } = event;
		setActiveId(null);

		if (!over) return;

		const item = items.find((i) => i.id === active.id);
		const targetBucketId = over.id;

		if (item.category === targetBucketId) {
			// Correct
			setBuckets((prev) => ({
				...prev,
				[targetBucketId]: [...prev[targetBucketId], item],
			}));
			setItems((prev) => prev.filter((i) => i.id !== active.id));

			// Visual feedback could go here
		} else {
			// Wrong - shake effect or toast
			// For now, just return item to stack (visual check failure)
			setFeedback("wrong");
			setTimeout(() => setFeedback(null), 1000);
		}
	};

	const allSorted = items.length === 0;

	return (
		<div className="w-full max-w-4xl mx-auto">
			<DndContext
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
				dropAnimation={{
					sideEffects: defaultDropAnimationSideEffects({
						styles: {
							active: {
								opacity: "0.4",
							},
						},
					}),
				}}>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
					<DroppableBucket
						id="unsafe"
						title={bucketTitleUnsafe}
						icon={X}
						color="error"
						items={buckets.unsafe}
					/>
					<DroppableBucket
						id="safe"
						title={bucketTitleSafe}
						icon={Check}
						color="success"
						items={buckets.safe}
					/>
				</div>

				{/* Source Stack */}
				<div className="min-h-[120px] flex items-center justify-center relative">
					<AnimatePresence>
						{items.length > 0 ? (
							<div className="relative w-full max-w-xs">
								<p className="text-center text-[var(--color-text-secondary)] mb-4 uppercase tracking-widest text-sm font-bold">
									Осталось: {items.length}
								</p>
								<DraggableItem id={items[0].id} content={items[0].content} />
								{/* Shadow items for stack effect */}
								{items.length > 1 && (
									<div className="absolute top-0 left-0 w-full h-full bg-[var(--color-bg-surface-2)] border border-[var(--color-bg-surface-3)] rounded-xl -z-10 scale-95 translate-y-2 opacity-50" />
								)}
							</div>
						) : (
							<motion.div
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								className="flex flex-col items-center">
								<h3 className="text-2xl font-bold text-[var(--color-success)] mb-6">
									Отличная работа!
								</h3>
								<button onClick={onComplete} className="btn-primary animate-pulse">
									Завершить задание
								</button>
							</motion.div>
						)}
					</AnimatePresence>

					{/* Error Overlay Feedback */}
					<AnimatePresence>
						{feedback === "wrong" && (
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0 }}
								className="absolute -bottom-12 text-[var(--color-error)] font-bold">
								Неверно! Подумай хорошо.
							</motion.div>
						)}
					</AnimatePresence>
				</div>

				<DragOverlay>
					{activeId ? (
						<DraggableItem
							id={activeId}
							content={items.find((i) => i.id === activeId)?.content}
							isOverlay
						/>
					) : null}
				</DragOverlay>
			</DndContext>
		</div>
	);
};
