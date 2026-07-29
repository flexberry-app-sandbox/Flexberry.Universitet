'use client';

import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { AxiosError } from 'axios';

import AircraftEFields from '@/modules/FormFields/AircraftEFields';
import useCreateAircraft from '@/hooks/Aircraft/useCreateAircraft';
import { useNotification } from '@/components/Notification';
import EditFormToolbar from '@/components/EditFormToolbar';
import { ROUTES_CONFIG } from '@/config/routes.config';
import { getQueryParamStateId } from '@/utils/getQueryParamStateId';
import { createUuid } from '@/utils/guidUtils';
import { IAircraftE } from '@/types/Aircraft.types';

export default function AircraftPageNew() {
  const viewName: string = 'AircraftE';

  const searchParams = useSearchParams();
  const router = useRouter();
  const [closeAfter, setCloseAfter] = useState(false);
  const { showError, showSuccess } = useNotification();

  const methods = useForm<IAircraftE>({
    defaultValues: {
      id: createUuid(),
      registrationNumber: '',
      model: '',
      capacity: 0,
    },
  });

  const handleSuccess = (newRecord: IAircraftE) => {
    showSuccess('Изменения успешно сохранены');
    if (closeAfter) {
      handleTransition();
    } else {
      router.push(`${ROUTES_CONFIG.AIRCRAFT_L}/${newRecord.id}${getQueryParamStateId(searchParams)}`);
    }
  };

  const handleError = (error: AxiosError | Error) => {
    showError(`Ошибка при сохранении: ${error.message}`);
  };

  const { createAircraftAsync } = useCreateAircraft<IAircraftE>(handleSuccess, handleError);

  const handleTransition = () => {
    router.push(`${ROUTES_CONFIG.AIRCRAFT_L}${getQueryParamStateId(searchParams)}`);
  };

  return (
    <FormProvider {...methods}>
      <Box component="form">
        <EditFormToolbar
          title="Aircraft"
          onSave={async (newValue: IAircraftE, close: boolean) => {
            setCloseAfter(close);
            await createAircraftAsync({ aircraft: newValue, viewName: viewName });
          }}
          onTransition={handleTransition}
        />
        <AircraftEFields isNew />
      </Box>
    </FormProvider>
  );
}
