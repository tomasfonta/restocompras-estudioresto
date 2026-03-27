import { useState, useCallback } from 'react';
import { placeOrder, callWaiter, requestBill } from '../services/restaurantService.js';

/**
 * Manages toast notifications, confirmation dialogs, and all async
 * restaurant actions (place order, call waiter, request bill).
 */
export function useActions(restaurantId, tableNumber, clearCart, onOrderSuccess) {
  const [submitting, setSubmitting] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'info' });
  const [dialog, setDialog] = useState(null);

  const closeDialog = useCallback(() => setDialog(null), []);

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: 'info' }), 3000);
  }, []);

  const handlePlaceOrder = useCallback(async (cartItems) => {
    if (cartItems.length === 0) return;
    setSubmitting(true);
    try {
      const result = await placeOrder(restaurantId, tableNumber, cartItems);
      if (result.success) {
        clearCart();
        onOrderSuccess();
        showToast(`✅ Pedido enviado (${result.orderId})`, 'success');
      } else {
        showToast('❌ Error al enviar el pedido. Intentá de nuevo.', 'error');
      }
    } catch {
      showToast('❌ Error al enviar el pedido. Intentá de nuevo.', 'error');
    } finally {
      setSubmitting(false);
    }
  }, [restaurantId, tableNumber, clearCart, onOrderSuccess, showToast]);

  const handleCallWaiter = useCallback(() => {
    const doCall = async () => {
      setActionLoading(true);
      try {
        await callWaiter(restaurantId, tableNumber);
        showToast('🛎 El mozo está en camino', 'success');
      } catch {
        showToast('❌ No se pudo llamar al mozo', 'error');
      } finally {
        setActionLoading(false);
      }
    };

    setDialog({
      title: '¿Llamar al mozo?',
      message: 'Un mozo se acercará a tu mesa en breve.',
      actions: [{ label: 'Confirmar', primary: true, onClick: doCall }],
    });
  }, [restaurantId, tableNumber, showToast]);

  const handleRequestBill = useCallback(() => {
    const doRequest = async (paymentMethod) => {
      setActionLoading(true);
      try {
        await requestBill(restaurantId, tableNumber, paymentMethod);
        const label = paymentMethod === 'efectivo' ? 'en efectivo' : 'con medios electrónicos';
        showToast(`🧾 La cuenta ${label} está en camino`, 'success');
      } catch {
        showToast('❌ No se pudo pedir la cuenta', 'error');
      } finally {
        setActionLoading(false);
      }
    };

    setDialog({
      title: 'Pedir la cuenta',
      message: '¿Cómo vas a pagar?',
      actions: [
        { label: '💵 Efectivo',            primary: false, onClick: () => doRequest('efectivo') },
        { label: '💳 Medios electrónicos', primary: true,  onClick: () => doRequest('electronico') },
      ],
    });
  }, [restaurantId, tableNumber, showToast]);

  return {
    submitting,
    actionLoading,
    toast,
    dialog,
    closeDialog,
    handlePlaceOrder,
    handleCallWaiter,
    handleRequestBill,
  };
}
