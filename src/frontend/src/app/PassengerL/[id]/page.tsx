'use client';

import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { AxiosError } from 'axios';

import PassengerEFields from '@/modules/FormFields/PassengerEFields';
import useGetPassenger from '@/hooks/Passenger/useGetPassenger';
import useUpdatePassenger from '@/hooks/Passenger/useUpdatePassenger';
import { useNotification } from '@/components/Notification';
import EditFormToolbar from '@/components/EditFormToolbar';
import CircularProgressCenter from '@/components/CircularProgressCenter';
import { IPassengerE } from '@/types/Passenger.types';
import { ROUTES_CONFIG } from '@/config/routes.config';
import DisabledFormProvider from '@/components/DisabledFormProvider';
import { useDataObjectLock } from '@/hooks/useDataObjectLock';
import { getQueryParamStateId } from '@/utils/getQueryParamStateId';
import { createUuid } from '@/utils/guidUtils';

export default function PassengerPageEdit() {
  const viewName: string = 'PassengerE';
  const { id } = useParams<{ id: NonEmptyString }>();
  const { mode } = useDataObjectLock(id);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { showError, showSuccess } = useNotification();

  const handleNotFound = () => {
    router.push(ROUTES_CONFIG.PASSENGER_L);
  };

  const { data, isLoading } = useGetPassenger<IPassengerE>({ id, viewName, onNotFound: handleNotFound });

  const [closeAfter, setCloseAfter] = useState(false);

  const methods = useForm<IPassengerE>({
    defaultValues: {
      id: createUuid(),
      passportNumber: '',
      firstName: '',
      lastName: '',
    },
  });

  const handleSuccess = () => {
    showSuccess('Изменения успешно сохранены');
    if (closeAfter) {
      handleTransition();
    }
  };

  const handleError = (error: AxiosError | Error) => {
    showError(`Ошибка при сохранении: ${error.message}`);
  };

  const { updatePassengerAsync } = useUpdatePassenger<IPassengerE>(handleSuccess, handleError);

  const handleSave = async (newValue: IPassengerE, close: boolean) => {
    setCloseAfter(close);
    await updatePassengerAsync({ passenger: newValue, viewName: viewName });
  };

  const handleTransition = () => {
    router.push(`${ROUTES_CONFIG.PASSENGER_L}${getQueryParamStateId(searchParams)}`);
  };

  useEffect(() => {
    if (!isLoading && data) {
      methods.reset(data);
    }
  }, [data, isLoading, methods]);

  if (isLoading) {
    return <CircularProgressCenter />;
  }

  return (
    <FormProvider {...methods}>
      <DisabledFormProvider disabled={mode === 'readonly'}>
        <Box component="form">
          <EditFormToolbar
            title="Passenger"
            onSave={handleSave}
            onTransition={handleTransition}
          />
          <PassengerEFields />
        </Box>
      </DisabledFormProvider>
    </FormProvider>
  );
}
