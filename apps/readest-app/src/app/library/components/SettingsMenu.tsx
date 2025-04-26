import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { MdCheck } from 'react-icons/md';
import { PiUserCircle } from 'react-icons/pi';

import { setAboutDialogVisible } from '@/components/AboutWindow';
import MenuItem from '@/components/MenuItem';
import { useAuth } from '@/context/AuthContext';
import { useEnv } from '@/context/EnvContext';
import { useTranslation } from '@/hooks/useTranslation';
import { DOWNLOAD_READEST_URL } from '@/services/constants';
import { isTauriAppPlatform, isWebAppPlatform } from '@/services/environment';
import { useSettingsStore } from '@/store/settingsStore';
import { navigateToLogin } from '@/utils/nav';
import { tauriHandleSetAlwaysOnTop, tauriHandleToggleFullScreen } from '@/utils/window';

interface SettingsMenuProps {
  setIsDropdownOpen?: (isOpen: boolean) => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ setIsDropdownOpen }) => {
  const _ = useTranslation();
  const router = useRouter();
  const { envConfig, appService } = useEnv();
  const { isLoggedIn } = useAuth();
  const { settings, setSettings, saveSettings } = useSettingsStore();
  const [isAutoUpload, setIsAutoUpload] = useState(settings.autoUpload);
  const [isAutoCheckUpdates, setIsAutoCheckUpdates] = useState(settings.autoCheckUpdates);
  const [isAlwaysOnTop, setIsAlwaysOnTop] = useState(settings.alwaysOnTop);
  const [isScreenWakeLock, setIsScreenWakeLock] = useState(settings.screenWakeLock);
  const [isAutoImportBooksOnOpen, setIsAutoImportBooksOnOpen] = useState(
    settings.autoImportBooksOnOpen,
  );

  const showAboutReadest = () => {
    setAboutDialogVisible(true);
    setIsDropdownOpen?.(false);
  };
  const downloadReadest = () => {
    window.open(DOWNLOAD_READEST_URL, '_blank');
    setIsDropdownOpen?.(false);
  };

  const handleUserLogin = () => {
    navigateToLogin(router);
    setIsDropdownOpen?.(false);
  };

  const handleReloadPage = () => {
    window.location.reload();
    setIsDropdownOpen?.(false);
  };

  const handleFullScreen = () => {
    tauriHandleToggleFullScreen();
    setIsDropdownOpen?.(false);
  };

  const toggleAlwaysOnTop = () => {
    settings.alwaysOnTop = !settings.alwaysOnTop;
    setSettings(settings);
    saveSettings(envConfig, settings);
    setIsAlwaysOnTop(settings.alwaysOnTop);
    tauriHandleSetAlwaysOnTop(settings.alwaysOnTop);
    setIsDropdownOpen?.(false);
  };

  const toggleAutoUploadBooks = () => {
    settings.autoUpload = !settings.autoUpload;
    setSettings(settings);
    saveSettings(envConfig, settings);
    setIsAutoUpload(settings.autoUpload);

    if (settings.autoUpload && !isLoggedIn) {
      navigateToLogin(router);
    }
  };

  const toggleAutoImportBooksOnOpen = () => {
    settings.autoImportBooksOnOpen = !settings.autoImportBooksOnOpen;
    setSettings(settings);
    saveSettings(envConfig, settings);
    setIsAutoImportBooksOnOpen(settings.autoImportBooksOnOpen);
  };

  const toggleAutoCheckUpdates = () => {
    settings.autoCheckUpdates = !settings.autoCheckUpdates;
    setSettings(settings);
    saveSettings(envConfig, settings);
    setIsAutoCheckUpdates(settings.autoCheckUpdates);
  };

  const toggleScreenWakeLock = () => {
    settings.screenWakeLock = !settings.screenWakeLock;
    setSettings(settings);
    saveSettings(envConfig, settings);
    setIsScreenWakeLock(settings.screenWakeLock);
  };

  const isWebApp = isWebAppPlatform();

  return (
    <div
      tabIndex={0}
      className='settings-menu dropdown-content no-triangle border-base-100 z-20 mt-2 shadow-2xl'
    >
      {isTauriAppPlatform() && isLoggedIn ? (
        <MenuItem label={_('Sign Out')} Icon={PiUserCircle} onClick={() => {}}></MenuItem>
      ) : (
        isTauriAppPlatform() && (
          <MenuItem label={_('Sign In')} Icon={PiUserCircle} onClick={handleUserLogin}></MenuItem>
        )
      )}
      <MenuItem
        label={_('Auto Upload Books to Cloud')}
        Icon={isAutoUpload ? MdCheck : undefined}
        onClick={toggleAutoUploadBooks}
      />
      {isTauriAppPlatform() && !appService?.isMobile && (
        <MenuItem
          label={_('Auto Import on File Open')}
          Icon={isAutoImportBooksOnOpen ? MdCheck : undefined}
          onClick={toggleAutoImportBooksOnOpen}
        />
      )}
      {appService?.hasUpdater && (
        <MenuItem
          label={_('Check Updates on Start')}
          Icon={isAutoCheckUpdates ? MdCheck : undefined}
          onClick={toggleAutoCheckUpdates}
        />
      )}
      <hr className='border-base-200 my-1' />
      {appService?.hasWindow && <MenuItem label={_('Fullscreen')} onClick={handleFullScreen} />}
      {appService?.hasWindow && (
        <MenuItem
          label={_('Always on Top')}
          Icon={isAlwaysOnTop ? MdCheck : undefined}
          onClick={toggleAlwaysOnTop}
        />
      )}
      <MenuItem
        label={_('Keep Screen Awake')}
        Icon={isScreenWakeLock ? MdCheck : undefined}
        onClick={toggleScreenWakeLock}
      />
      <MenuItem label={_('Reload Page')} onClick={handleReloadPage} />
      <hr className='border-base-200 my-1' />
      {isWebApp && <MenuItem label={_('Download Readest')} onClick={downloadReadest} />}
      <MenuItem label={_('About Readest')} onClick={showAboutReadest} />
    </div>
  );
};

export default SettingsMenu;
