'use client';

import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { AxiosError } from 'axios';

import PassengerEFields from '@/modules/FormFields/PassengerEFields';
import useCreatePassenger from '@/hooks/Passenger/useCreatePassenger';
import { useNotification } from '@/components/Notification';
import EditFormToolbar from '@/components/EditFormToolbar';
import { ROUTES_CONFIG } from '@/config/routes.config';
import { getQueryParamStateId } from '@/utils/getQueryParamStateId';
import { createUuid } from '@/utils/guidUtils';
import { IPassengerE } from '@/types/Passenger.types';

export default function PassengerPageNew() {
  const viewName: string = 'PassengerE';

  const searchParams = useSearchParams();
  const router = useRouter();
  const [closeAfter, setCloseAfter] = useState(false);
  const { showError, showSuccess } = useNotification();

  const methods = useForm<IPassengerE>({
    defaultValues: {
      id: createUuid(),
      passportNumber: '',
      firstName: '',
      lastName: '',
    },
  });

  const handleSuccess = (newRecord: IPassengerE) => {
    showSuccess('Изменения успешно сохранены');
    if (closeAfter) {
      handleTransition();
    } else {
      router.push(`${ROUTES_CONFIG.PASSENGER_L}/${newRecord.id}${getQueryParamStateId(searchParams)}`);
    }
  };

  const handleError = (error: AxiosError | Error) => {
    showError(`Ошибка при сохранении: ${error.message}`);
  };

  const { createPassengerAsync } = useCreatePassenger<IPassengerE>(handleSuccess, handleError);

  const handleTransition = () => {
    router.push(`${ROUTES_CONFIG.PASSENGER_L}${getQueryParamStateId(searchParams)}`);
  };

  return (
    <FormProvider {...methods}>
      <Box component="form">
        <EditFormToolbar
          title="Passenger"
          onSave={async (newValue: IPassengerE, close: boolean) => {
            setCloseAfter(close);
            await createPassengerAsync({ passenger: newValue, viewName: viewName });
          }}
          onTransition={handleTransition}
        />
        <PassengerEFields isNew />
      </Box>
    </FormProvider>
  );
}
