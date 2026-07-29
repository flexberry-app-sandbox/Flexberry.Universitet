'use client';

import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { AxiosError } from 'axios';

import AirplaneEFields from '@/modules/FormFields/AirplaneEFields';
import useGetAirplane from '@/hooks/Airplane/useGetAirplane';
import useUpdateAirplane from '@/hooks/Airplane/useUpdateAirplane';
import { useNotification } from '@/components/Notification';
import EditFormToolbar from '@/components/EditFormToolbar';
import CircularProgressCenter from '@/components/CircularProgressCenter';
import { IAirplaneE } from '@/types/Airplane.types';
import { ROUTES_CONFIG } from '@/config/routes.config';
import DisabledFormProvider from '@/components/DisabledFormProvider';
import { useDataObjectLock } from '@/hooks/useDataObjectLock';
import { getQueryParamStateId } from '@/utils/getQueryParamStateId';
import { createUuid } from '@/utils/guidUtils';

export default function AirplanePageEdit() {
  const viewName: string = 'AirplaneE';
  const { id } = useParams<{ id: NonEmptyString }>();
  const { mode } = useDataObjectLock(id);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { showError, showSuccess } = useNotification();

  const handleNotFound = () => {
    router.push(ROUTES_CONFIG.AIRPLANE_L);
  };

  const { data, isLoading } = useGetAirplane<IAirplaneE>({ id, viewName, onNotFound: handleNotFound });

  const [closeAfter, setCloseAfter] = useState(false);

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

  const handleSuccess = () => {
    showSuccess('Изменения успешно сохранены');
    if (closeAfter) {
      handleTransition();
    }
  };

  const handleError = (error: AxiosError | Error) => {
    showError(`Ошибка при сохранении: ${error.message}`);
  };

  const { updateAirplaneAsync } = useUpdateAirplane<IAirplaneE>(handleSuccess, handleError);

  const handleSave = async (newValue: IAirplaneE, close: boolean) => {
    setCloseAfter(close);
    await updateAirplaneAsync({ airplane: newValue, viewName: viewName });
  };

  const handleTransition = () => {
    router.push(`${ROUTES_CONFIG.AIRPLANE_L}${getQueryParamStateId(searchParams)}`);
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
            title="Airplane"
            onSave={handleSave}
            onTransition={handleTransition}
          />
          <AirplaneEFields />
        </Box>
      </DisabledFormProvider>
    </FormProvider>
  );
}
