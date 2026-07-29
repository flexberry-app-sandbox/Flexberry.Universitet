'use client';

import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { AxiosError } from 'axios';

import AirportEFields from '@/modules/FormFields/AirportEFields';
import useCreateAirport from '@/hooks/Airport/useCreateAirport';
import { useNotification } from '@/components/Notification';
import EditFormToolbar from '@/components/EditFormToolbar';
import { ROUTES_CONFIG } from '@/config/routes.config';
import { getQueryParamStateId } from '@/utils/getQueryParamStateId';
import { createUuid } from '@/utils/guidUtils';
import { IAirportE } from '@/types/Airport.types';

export default function AirportPageNew() {
  const viewName: string = 'AirportE';

  const searchParams = useSearchParams();
  const router = useRouter();
  const [closeAfter, setCloseAfter] = useState(false);
  const { showError, showSuccess } = useNotification();

  const methods = useForm<IAirportE>({
    defaultValues: {
      id: createUuid(),
      code: '',
      name: '',
    },
  });

  const handleSuccess = (newRecord: IAirportE) => {
    showSuccess('Изменения успешно сохранены');
    if (closeAfter) {
      handleTransition();
    } else {
      router.push(`${ROUTES_CONFIG.AIRPORT_L}/${newRecord.id}${getQueryParamStateId(searchParams)}`);
    }
  };

  const handleError = (error: AxiosError | Error) => {
    showError(`Ошибка при сохранении: ${error.message}`);
  };

  const { createAirportAsync } = useCreateAirport<IAirportE>(handleSuccess, handleError);

  const handleTransition = () => {
    router.push(`${ROUTES_CONFIG.AIRPORT_L}${getQueryParamStateId(searchParams)}`);
  };

  return (
    <FormProvider {...methods}>
      <Box component="form">
        <EditFormToolbar
          title="Airport"
          onSave={async (newValue: IAirportE, close: boolean) => {
            setCloseAfter(close);
            await createAirportAsync({ airport: newValue, viewName: viewName });
          }}
          onTransition={handleTransition}
        />
        <AirportEFields isNew />
      </Box>
    </FormProvider>
  );
}
