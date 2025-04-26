'use client';

import clsx from 'clsx';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { IoArrowBack } from 'react-icons/io5';
import { PiUserCircle } from 'react-icons/pi';
import { useEnv } from '@/context/EnvContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { useSettingsStore } from '@/store/settingsStore';
import { useTrafficLightStore } from '@/store/trafficLightStore';
import { QuotaType, UserPlan } from '@/types/user';
import { getStoragePlanData, getUserPlan } from '@/utils/access';
import { navigateToLibrary } from '@/utils/nav';
import { deleteUser } from '@/libs/user';
import { eventDispatcher } from '@/utils/event';
import { Toast } from '@/components/Toast';
import WindowButtons from '@/components/WindowButtons';
import Quota from '@/components/Quota';

const ProfilePage = () => {
  const _ = useTranslation();
  const router = useRouter();
  const { envConfig, appService } = useEnv();
  const { isLoggedIn, logout } = useAuth();
  const { isTrafficLightVisible } = useTrafficLightStore();
  const { settings, setSettings, saveSettings } = useSettingsStore();
  const [userPlan, setUserPlan] = useState<UserPlan>('free');
  const [quotas, setQuotas] = React.useState<QuotaType[]>([]);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const headerRef = useRef<HTMLDivElement>(null);

  useTheme({ systemUIVisible: false });

  const handleGoBack = () => {
    navigateToLibrary(router);
  };

  const handleLogout = () => {
    logout();
    settings.keepLogin = false;
    setSettings(settings);
    saveSettings(envConfig, settings);
    navigateToLibrary(router);
  };

  const handleDeleteRequest = () => {
    setShowConfirmDelete(true);
  };

  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteUser();
      handleLogout();
    } catch (error) {
      console.error('Error deleting user:', error);
      eventDispatcher.dispatch('toast', {
        type: 'error',
        message: _('Failed to delete user. Please try again later.'),
      });
    }
    setShowConfirmDelete(false);
  };

  const getPlanDetails = (userPlan: UserPlan) => {
    switch (userPlan) {
      case 'free':
        return {
          name: _('Free Tier'),
          color: 'bg-gray-200 text-gray-800',
          features: [
            _('Community Support'),
            _('DeepL Free Access'),
            _('Essential Text-to-Speech Voices'),
            _('Unlimited Offline/Online Reading'),
            _('Unlimited Cloud Sync Devices'),
            _('500 MB Cloud Sync Space'),
          ],
        };
      case 'plus':
        return {
          name: _('Plus Tier'),
          color: 'bg-blue-200 text-blue-800',
          features: [
            _('Includes All Free Tier Benefits'),
            _('Priority Support'),
            _('AI Summaries'),
            _('AI Translations'),
            _('DeepL Pro Access'),
            _('Expanded Text-to-Speech Voices'),
            _('2000 MB Cloud Sync Space'),
          ],
        };
      case 'pro':
        return {
          name: _('Pro Tier'),
          color: 'bg-purple-200 text-purple-800',
          features: [
            _('Includes All Plus Tier Benefits'),
            _('Unlimited AI Summaries'),
            _('Unlimited AI Translations'),
            _('Unlimited DeepL Pro Access'),
            _('Advanced AI Tools'),
            _('Early Feature Access'),
            _('10 GB Cloud Sync Space'),
          ],
        };
    }
  };

  if (!isLoggedIn) {
    return (
      <div className='mx-auto max-w-4xl px-4 py-8'>
        <div className='overflow-hidden rounded-lg shadow-md'>
          <div className='flex min-h-[300px] items-center justify-center p-6'>
            <div className='text-base-content animate-pulse'>{_('Loading profile...')}</div>
          </div>
        </div>
      </div>
    );
  }

  return <></>;
};

export default ProfilePage;
