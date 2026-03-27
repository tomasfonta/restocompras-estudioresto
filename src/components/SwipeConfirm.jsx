import { useRef, useState } from 'react';

/**
 * Swipe-to-confirm — handle on the LEFT, swipe RIGHT to confirm.
 */
export default function SwipeConfirm({ onConfirm, isLoading }) {
  const trackRef = useRef(null);
  const [dragX, setDragX] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const dragging = useRef(false);
  const startX = useRef(0);

  const HANDLE_W = 58;
  const PADDING  = 6;

  function getMaxTravel() {
    const track = trackRef.current;
    if (!track) return 220;
    return track.clientWidth - HANDLE_W - PADDING * 2;
  }

  function onPointerDown(e) {
    if (confirmed || isLoading) return;
    dragging.current = true;
    startX.current = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e) {
    if (!dragging.current) return;
    const delta = e.clientX - startX.current; // positive = right
    const travel = Math.max(0, Math.min(delta, getMaxTravel()));
    setDragX(travel);

    if (travel >= getMaxTravel() * 0.78) {
      dragging.current = false;
      setDragX(getMaxTravel());
      setConfirmed(true);
      setTimeout(() => {
        onConfirm();
        setTimeout(() => { setConfirmed(false); setDragX(0); }, 1600);
      }, 280);
    }
  }

  function onPointerUp() {
    if (!dragging.current) return;
    dragging.current = false;
    setDragX(0); // snap back
  }

  const maxTravel = getMaxTravel();
  const progress = maxTravel > 0 ? dragX / maxTravel : 0; // 0→1

  return (
    <div
      ref={trackRef}
      className={`swipe-confirm ${confirmed ? 'swipe-confirm--done' : ''} ${isLoading ? 'swipe-confirm--loading' : ''}`}
    >
      {/* Handle on the LEFT */}
      <div
        className="swipe-confirm__handle"
        style={{ transform: `translateX(${dragX}px)` }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {confirmed
          ? <span className="swipe-confirm__check">✓</span>
          : <span className="swipe-confirm__arrows">&gt;&gt;&gt;</span>
        }
      </div>

      {/* Label on the RIGHT, fades out as handle drags right */}
      <span
        className="swipe-confirm__label"
        style={{ opacity: Math.max(0, 1 - progress * 2.2) }}
      >
        {isLoading ? 'Enviando…' : 'Enviar pedido'}
      </span>
    </div>
  );
}
