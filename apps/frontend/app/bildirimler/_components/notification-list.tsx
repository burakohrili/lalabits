'use client';

import { useRouter } from 'next/navigation';

export interface NotificationItem {
  id: string;
  notification_type: string;
  title: string;
  body: string;
  action_url: string | null;
  read_at: string | null;
  created_at: string;
}

interface Props {
  items: NotificationItem[];
  accessToken: string;
  onRead: (id: string) => void;
}

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const rtf = new Intl.RelativeTimeFormat('tr', { numeric: 'auto' });

  if (seconds < 60) return rtf.format(-seconds, 'second');
  if (minutes < 60) return rtf.format(-minutes, 'minute');
  if (hours < 24) return rtf.format(-hours, 'hour');
  return rtf.format(-days, 'day');
}

const API = process.env.NEXT_PUBLIC_API_URL!;

export default function NotificationList({ items, accessToken, onRead }: Props) {
  const router = useRouter();

  async function handleClick(item: NotificationItem) {
    if (!item.read_at) {
      try {
        await fetch(`${API}/notifications/${item.id}/read`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        onRead(item.id);
      } catch {
        // best-effort
      }
    }
    if (item.action_url) {
      router.push(item.action_url);
    }
  }

  if (items.length === 0) {
    return (
      <div className="py-16 text-center text-muted text-sm">
        Henüz bildiriminiz yok.
      </div>
    );
  }

  return (
    <ul className="divide-y divide-border">
      {items.map((item) => (
        <li key={item.id}>
          <button
            type="button"
            onClick={() => void handleClick(item)}
            className={[
              'w-full text-left px-4 py-4 flex gap-3 hover:bg-surface-raised transition-colors',
              !item.read_at ? 'border-l-2 border-primary' : 'border-l-2 border-transparent',
            ].join(' ')}
          >
            {/* Unread dot */}
            <span className="mt-1.5 shrink-0 w-2 h-2 rounded-full bg-primary opacity-0" aria-hidden />
            <div className="flex-1 min-w-0">
              <p
                className={[
                  'text-sm font-medium truncate',
                  !item.read_at ? 'text-foreground' : 'text-muted',
                ].join(' ')}
              >
                {item.title}
              </p>
              <p className="text-sm text-muted mt-0.5 line-clamp-2">{item.body}</p>
              <p className="text-xs text-muted/70 mt-1">{relativeTime(item.created_at)}</p>
            </div>
            {!item.read_at && (
              <span className="mt-1.5 shrink-0 w-2 h-2 rounded-full bg-primary" aria-hidden />
            )}
          </button>
        </li>
      ))}
    </ul>
  );
}
