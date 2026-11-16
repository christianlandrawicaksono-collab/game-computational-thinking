import React, { useState } from 'react';
import type { OrderData } from './engine/types';
import { ALL_ORDERS } from './levels';
import { MainMenu } from './ui/MainMenu';
import { LevelSelect } from './ui/LevelSelect';
import { Workspace } from './ui/Workspace';

interface CodeFactoryAppProps {
  onBackToHub: () => void;
}

type ScreenState = 'MENU' | 'LEVEL_SELECT' | 'WORKSPACE';

export const CodeFactoryApp: React.FC<CodeFactoryAppProps> = ({ onBackToHub }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('MENU');
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);

  // Navigate to order
  const handleSelectOrder = (order: OrderData) => {
    setSelectedOrder(order);
    setCurrentScreen('WORKSPACE');
  };

  // Find next order in sequence
  const getNextOrder = (): OrderData | null => {
    if (!selectedOrder) return null;
    const currentIndex = ALL_ORDERS.findIndex((o) => o.id === selectedOrder.id);
    if (currentIndex >= 0 && currentIndex < ALL_ORDERS.length - 1) {
      return ALL_ORDERS[currentIndex + 1];
    }
    return null;
  };

  const nextOrder = getNextOrder();

  const handleSelectNextOrder = () => {
    if (nextOrder) {
      setSelectedOrder(nextOrder);
    } else {
      setCurrentScreen('LEVEL_SELECT');
    }
  };

  if (currentScreen === 'WORKSPACE' && selectedOrder) {
    return (
      <Workspace
        key={selectedOrder.id}
        order={selectedOrder}
        onBackToLevelSelect={() => setCurrentScreen('LEVEL_SELECT')}
        onSelectNextOrder={nextOrder ? handleSelectNextOrder : undefined}
        hasNextOrder={Boolean(nextOrder)}
      />
    );
  }

  if (currentScreen === 'LEVEL_SELECT') {
    return (
      <LevelSelect
        onSelectOrder={handleSelectOrder}
        onBackToMenu={() => setCurrentScreen('MENU')}
      />
    );
  }

  return (
    <MainMenu
      onStart={() => setCurrentScreen('LEVEL_SELECT')}
      onBackToHub={onBackToHub}
    />
  );
};
