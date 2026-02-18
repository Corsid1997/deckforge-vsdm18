import { useEffect, useRef, useCallback } from 'react';
import { useDeckStore } from '../store/useDeckStore';

const RECONNECT_INTERVAL = 5000;

export function useBridge() {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = useRef(true);

  const bridgeUrl = useDeckStore((s) => s.bridgeUrl);
  const setBridgeStatus = useDeckStore((s) => s.setBridgeStatus);
  const triggerButton = useDeckStore((s) => s.triggerButton);

  const connect = useCallback(() => {
    if (!mounted.current) return;
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    try {
      setBridgeStatus('connecting');
      const ws = new WebSocket(bridgeUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!mounted.current) { ws.close(); return; }
        setBridgeStatus('connected');
        console.log('[DeckForge] Bridge connected:', bridgeUrl);
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'button_press' && typeof msg.buttonId === 'number') {
            triggerButton(msg.buttonId);
          }
        } catch {
          // ignore parse errors
        }
      };

      ws.onerror = () => {
        setBridgeStatus('disconnected');
      };

      ws.onclose = () => {
        setBridgeStatus('disconnected');
        wsRef.current = null;
        if (mounted.current) {
          reconnectTimer.current = setTimeout(connect, RECONNECT_INTERVAL);
        }
      };
    } catch (err) {
      setBridgeStatus('disconnected');
      if (mounted.current) {
        reconnectTimer.current = setTimeout(connect, RECONNECT_INTERVAL);
      }
    }
  }, [bridgeUrl, setBridgeStatus, triggerButton]);

  useEffect(() => {
    mounted.current = true;
    connect();

    return () => {
      mounted.current = false;
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      wsRef.current?.close();
    };
  }, [connect]);

  // Expose send function for triggering actions via bridge
  const sendTrigger = useCallback((buttonId: number, actionType: string, actionConfig: object) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'trigger', buttonId, actionType, actionConfig }));
    }
  }, []);

  return { sendTrigger };
}
