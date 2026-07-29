'use client';

import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { AxiosError } from 'axios';

import HelicopterEFields from '@/modules/FormFields/HelicopterEFields';
import useGetHelicopter from '@/hooks/Helicopter/useGetHelicopter';
import useUpdateHelicopter from '@/hooks/Helicopter/useUpdateHelicopter';
import { useNotification } from '@/components/Notification';
import EditFormToolbar from '@/components/EditFormToolbar';
import CircularProgressCenter from '@/components/CircularProgressCenter';
import { IHelicopterE } from '@/types/Helicopter.types';
import { ROUTES_CONFIG } from '@/config/routes.config';
import DisabledFormProvider from '@/components/DisabledFormProvider';
import { useDataObjectLock } from '@/hooks/useDataObjectLock';
import { getQueryParamStateId } from '@/utils/getQueryParamStateId';
import { createUuid } from '@/utils/guidUtils';

export default function HelicopterPageEdit() {
  const viewName: string = 'HelicopterE';
  const { id } = useParams<{ id: NonEmptyString }>();
  const { mode } = useDataObjectLock(id);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { showError, showSuccess } = useNotification();

  const handleNotFound = () => {
    router.push(ROUTES_CONFIG.HELICOPTER_L);
  };

  const { data, isLoading } = useGetHelicopter<IHelicopterE>({ id, viewName, onNotFound: handleNotFound });

  const [closeAfter, setCloseAfter] = useState(false);

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

  const handleSuccess = () => {
    showSuccess('Изменения успешно сохранены');
    if (closeAfter) {
      handleTransition();
    }
  };

  const handleError = (error: AxiosError | Error) => {
    showError(`Ошибка при сохранении: ${error.message}`);
  };

  const { updateHelicopterAsync } = useUpdateHelicopter<IHelicopterE>(handleSuccess, handleError);

  const handleSave = async (newValue: IHelicopterE, close: boolean) => {
    setCloseAfter(close);
    await updateHelicopterAsync({ helicopter: newValue, viewName: viewName });
  };

  const handleTransition = () => {
    router.push(`${ROUTES_CONFIG.HELICOPTER_L}${getQueryParamStateId(searchParams)}`);
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
            title="Helicopter"
            onSave={handleSave}
            onTransition={handleTransition}
          />
          <HelicopterEFields />
        </Box>
      </DisabledFormProvider>
    </FormProvider>
  );
}
