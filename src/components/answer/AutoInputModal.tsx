'use client';

import { SignInButton } from '@/components/auth/signin_button';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@/components/heroui';

import type { Session } from 'next-auth';

interface AutoInputModalProps {
  isOpen: boolean;
  isLoading: boolean;
  progressMessage: string;
  session: Session | null;
  onClose: () => void;
  onAutoInput: () => Promise<void>;
}

const AutoInputModal = ({
  isOpen,
  isLoading,
  progressMessage,
  session,
  onClose,
  onAutoInput,
}: AutoInputModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} placement="center">
      <ModalContent>
        <ModalHeader>google calendar から予定を取得します</ModalHeader>
        <ModalBody>
          {!session?.user ? (
            <>
              <p>Google連携が必要な機能です</p>
              <p>こちらからGoogle連携を許可してください</p>
              <SignInButton />
            </>
          ) : (
            <ol className="list-decimal list-inside text-sm flex flex-col gap-2">
              <li>Google Calendar の予定を取得する</li>
              <li>
                取得した予定と日程調整候補日が被っていない場合は、参加とします
              </li>
              <li>
                取得した予定と日程調整候補日が一部被っている場合は、条件付き参加とします
              </li>
              <li>
                取得した予定と日程調整候補日が完全に被っている場合は、参加不可とします
              </li>
            </ol>
          )}
        </ModalBody>
        <ModalFooter className="w-full">
          <Button
            color="primary"
            className="w-full"
            onPress={onAutoInput}
            isLoading={isLoading}
            isDisabled={isLoading || !session?.user}
          >
            {isLoading ? progressMessage : '予定を取得して自動入力'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AutoInputModal;
