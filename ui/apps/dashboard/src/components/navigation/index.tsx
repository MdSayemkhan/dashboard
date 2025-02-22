/*
Copyright 2024 The Karmada Authors.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { FC, CSSProperties, useState } from 'react';
import styles from './index.module.less';
import karmadaLogo from '@/assets/karmada-logo.svg';
import {
  setLang,
  getLangIcon,
  getLang,
  supportedLangConfig,
  getLangTitle,
} from '@/utils/i18n';
import { Dropdown, Tooltip, message, Modal } from 'antd';
import { CodeOutlined } from '@ant-design/icons';
import { createTerminal, getTerminalSession } from '@/services/terminal';
import TerminalComponent from '../terminal';

export interface IUserInfo {
  id: number;
  username: string;
  avatar: string;
}

interface INavigationProps {
  headerStyle?: CSSProperties;
  usePlaceholder?: boolean;
  brandText?: string;
  userInfo?: IUserInfo;
  onTerminalClick?: () => void;
}

const Navigation: FC<INavigationProps> = (props) => {
  const {
    headerStyle = {},
    usePlaceholder = true,
    brandText = 'Karmada Dashboard',
    userInfo,
  } = props;

  const [isTerminalVisible, setTerminalVisible] = useState(false);
  const [terminalSession, setTerminalSession] = useState<string>('');

  const handleTerminalClick = async () => {
    try {
      const response = await createTerminal();
      const session = await getTerminalSession(
        response.namespace,
        response.podName,
        response.container
      );
      setTerminalSession(session.sessionId);
      setTerminalVisible(true);
    } catch (error) {
      message.error('Failed to create terminal');
    }
  };

  return (
    <>
      <div className={styles.navbar}>
        <div className={styles.header} style={headerStyle}>
          <div className={styles.left}>
            <div className={styles.brand}>
              <div className={styles.logoWrap}>
                <img className={styles.logo} src={karmadaLogo} />
              </div>
              <div className={styles.text}>{brandText}</div>
            </div>
          </div>
          <div className={styles.center}>
            {/* placeholder for center element */}
          </div>
          <div className={styles.right}>
            <div className={styles.extra}>
              <Tooltip title="Terminal">
                <CodeOutlined 
                  className={styles.terminalIcon} 
                  onClick={handleTerminalClick}
                />
              </Tooltip>
              <Dropdown
                menu={{
                  onClick: async (v) => {
                    await setLang(v.key);
                    window.location.reload();
                  },
                  selectedKeys: [getLang()],
                  items: Object.keys(supportedLangConfig).map((lang) => {
                    return {
                      key: lang,
                      label: getLangTitle(lang),
                    };
                  }),
                }}
                placement="bottomLeft"
                arrow
              >
                <div>{getLangIcon(getLang())}</div>
              </Dropdown>
            </div>
            {/* user info */}
            {userInfo && (
              <div className={styles.userWrap}>
                <div className={styles.user}>
                  <img src={userInfo?.avatar} className={styles.avatar} />
                </div>
              </div>
            )}
          </div>
        </div>
        {usePlaceholder && <div className={styles.placeholder} />}
      </div>
      <Modal 
        title="Terminal"
        open={isTerminalVisible}
        onCancel={() => setTerminalVisible(false)}
        width={800}
      >
        {terminalSession && <TerminalComponent sessionId={terminalSession} />}
      </Modal>
    </>
  );
};
export default Navigation;

