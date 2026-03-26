import ChannelInput from '@/components/ChannelInput';
import EmptyState from '@/components/EmptyState';

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-2xl flex flex-col gap-8">
        <div className="flex flex-col gap-2 text-center">
          <p className="label-caps">YouTube Competitor Intelligence</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-ink dark:text-chalk leading-tight">
            See what is winning
            <br />
            <span className="text-forest dark:text-grove">on any channel</span>
          </h1>
          <p className="font-body text-fog text-base mt-2 leading-relaxed">
            Paste any YouTube channel URL and instantly surface their top
            videos, performance scores, engagement trends, and growth velocity.
          </p>
        </div>

        <ChannelInput />
        <EmptyState />
      </div>
    </div>
  );
}
