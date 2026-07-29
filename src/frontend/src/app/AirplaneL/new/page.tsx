'use client';

import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { AxiosError } from 'axios';

import AirplaneEFields from '@/modules/FormFields/AirplaneEFields';
import useCreateAirplane from '@/hooks/Airplane/useCreateAirplane';
import { useNotification } from '@/components/Notification';
import EditFormToolbar from '@/components/EditFormToolbar';
import { ROUTES_CONFIG } from '@/config/routes.config';
import { getQueryParamStateId } from '@/utils/getQueryParamStateId';
import { createUuid } from '@/utils/guidUtils';
import { IAirplaneE } from '@/types/Airplane.types';

export default function AirplanePageNew() {
  const viewName: string = 'AirplaneE';

  const searchParams = useSearchParams();
  const router = useRouter();
  const [closeAfter, setCloseAfter] = useState(false);
  const { showError, showSuccess } = useNotification();

  const methods = useForm<IAirplaneE>({
    defaultValues: {
      id: createUuid(),
      wingspan: 0,
      engineCount: 0,
      registrationNumber: '',
      model: '',
      capacity: 0,
    },
  });

  const handleSuccess = (newRecord: IAirplaneE) => {
    showSuccess('Изменения успешно сохранены');
    if (closeAfter) {
      handleTransition();
    } else {
      router.push(`${ROUTES_CONFIG.AIRPLANE_L}/${newRecord.id}${getQueryParamStateId(searchParams)}`);
    }
  };

  const handleError = (error: AxiosError | Error) => {
    showError(`Ошибка при сохранении: ${error.message}`);
  };

  const { createAirplaneAsync } = useCreateAirplane<IAirplaneE>(handleSuccess, handleError);

  const handleTransition = () => {
    router.push(`${ROUTES_CONFIG.AIRPLANE_L}${getQueryParamStateId(searchParams)}`);
  };

  return (
    <FormProvider {...methods}>
      <Box component="form">
        <EditFormToolbar
          title="Airplane"
          onSave={async (newValue: IAirplaneE, close: boolean) => {
            setCloseAfter(close);
            await createAirplaneAsync({ airplane: newValue, viewName: viewName });
          }}
          onTransition={handleTransition}
        />
        <AirplaneEFields isNew />
      </Box>
    </FormProvider>
  );
}
