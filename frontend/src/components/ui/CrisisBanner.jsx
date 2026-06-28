import { AlertTriangle } from 'lucide-react';

export default function CrisisBanner() {
    return (
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 mb-6 flex items-start gap-3 shadow-lg shadow-rose-900/10">
            <AlertTriangle className="w-6 h-6 text-rose-500 flex-shrink-0 mt-0.5" />
            <div>
                <h4 className="text-rose-500 font-semibold mb-1">Support is available</h4>
                <p className="text-sm text-rose-400 leading-relaxed">
                    It sounds like you're going through a very difficult time. You don't have to face this alone. 
                    Please consider reaching out to a crisis counselor or healthcare professional.
                </p>
                <div className="mt-3 flex gap-4">
                    <a href="https://blog.opencounseling.com/suicide-hotlines/" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-rose-300 hover:text-white underline underline-offset-2 transition-colors">
                        International Resources
                    </a>
                </div>
            </div>
        </div>
    );
}
