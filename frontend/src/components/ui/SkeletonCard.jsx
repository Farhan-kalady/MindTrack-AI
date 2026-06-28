export default function SkeletonCard() {
    return (
        <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-xl p-6 animate-pulse w-full">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-neutral-700" />
                <div className="space-y-2 flex-grow">
                    <div className="h-4 bg-neutral-700 rounded-md w-1/3" />
                    <div className="h-3 bg-neutral-700 rounded-md w-1/4" />
                </div>
            </div>
            <div className="space-y-3">
                <div className="h-3 bg-neutral-700 rounded-md w-full" />
                <div className="h-3 bg-neutral-700 rounded-md w-5/6" />
                <div className="h-3 bg-neutral-700 rounded-md w-4/6" />
            </div>
            <div className="mt-8">
                <div className="h-2 bg-neutral-700 rounded-full w-full mb-2" />
                <div className="flex justify-between">
                    <div className="h-2 bg-neutral-700 rounded-full w-1/6" />
                    <div className="h-2 bg-neutral-700 rounded-full w-1/6" />
                </div>
            </div>
        </div>
    );
}
