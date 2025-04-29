/**
 * Componente de input optimizado que evita la pérdida de foco durante la edición.
 * 
 * Problema que resuelve:
 * - En componentes complejos con frecuentes re-renders, los inputs convencionales
 *   pierden el foco porque React recrea el elemento DOM al actualizar el estado.
 * 
 * Solución implementada:
 * 1. Usa React.forwardRef para mantener la referencia estable al elemento DOM
 * 2. Maneja el valor internamente sin recrear el componente en cada cambio
 * 3. Compatible con TypeScript para seguridad de tipos
 * 
 * Casos de uso:
 * - Formularios dentro de acordeones/colapsables
 * - Inputs en listas con renderizado dinámico
 * - Componentes con actualizaciones frecuentes de estado
 * 
 * Nota: Para formularios complejos, considerar el uso de react-hook-form
 * junto con este componente.
 */"use client"

import React from 'react';

export const StableInput = React.forwardRef<HTMLInputElement, {
    value: string | number;
    onChange: (value: string) => void;
  } & React.InputHTMLAttributes<HTMLInputElement>>(
    ({ value, onChange, ...props }, ref) => {
      return (
        <input
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          {...props}
        />
      );
    }
  );
  StableInput.displayName = "StableInput";