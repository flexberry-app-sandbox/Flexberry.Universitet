'use client';

import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { AxiosError } from 'axios';

import HelicopterEFields from '@/modules/FormFields/HelicopterEFields';
import useCreateHelicopter from '@/hooks/Helicopter/useCreateHelicopter';
import { useNotification } from '@/components/Notification';
import EditFormToolbar from '@/components/EditFormToolbar';
import { ROUTES_CONFIG } from '@/config/routes.config';
import { getQueryParamStateId } from '@/utils/getQueryParamStateId';
import { createUuid } from '@/utils/guidUtils';
import { IHelicopterE } from '@/types/Helicopter.types';

export default function HelicopterPageNew() {
  const viewName: string = 'HelicopterE';

  const searchParams = useSearchParams();
  const router = useRouter();
  const [closeAfter, setCloseAfter] = useState(false);
  const { showError, showSuccess } = useNotification();

  const methods = useForm<IHelicopterE>({
    defaultValues: {
      id: createUuid(),
      rotorDiameter: 0,
      maxAltitude: 0,
      registrationNumber: '',
      model: '',
      capacity: 0,
    },
  });

  const handleSuccess = (newRecord: IHelicopterE) => {
    showSuccess('Изменения успешно сохранены');
    if (closeAfter) {
      handleTransition();
    } else {
      router.push(`${ROUTES_CONFIG.HELICOPTER_L}/${newRecord.id}${getQueryParamStateId(searchParams)}`);
    }
  };

  const handleError = (error: AxiosError | Error) => {
    showError(`Ошибка при сохранении: ${error.message}`);
  };

  const { createHelicopterAsync } = useCreateHelicopter<IHelicopterE>(handleSuccess, handleError);

  const handleTransition = () => {
    router.push(`${ROUTES_CONFIG.HELICOPTER_L}${getQueryParamStateId(searchParams)}`);
  };

  return (
    <FormProvider {...methods}>
      <Box component="form">
        <EditFormToolbar
          title="Helicopter"
          onSave={async (newValue: IHelicopterE, close: boolean) => {
            setCloseAfter(close);
            await createHelicopterAsync({ helicopter: newValue, viewName: viewName });
          }}
          onTransition={handleTransition}
        />
        <HelicopterEFields isNew />
      </Box>
    </FormProvider>
  );
}
