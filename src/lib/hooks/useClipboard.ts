import { useCallback, useState } from 'react';

interface UseClipboardOptions {
  /**
   * コピー完了状態をリセットするまでの時間（ミリ秒）
   * @default 2000
   */
  resetTime?: number;
  /**
   * コピー成功時のコールバック
   */
  onSuccess?: (text: string) => void;
  /**
   * コピー失敗時のコールバック
   */
  onError?: (error: Error) => void;
}

interface UseClipboardReturn {
  /**
   * コピーが完了したかどうかの状態
   */
  copied: boolean;
  /**
   * テキストをクリップボードにコピーする関数
   */
  copyToClipboard: (text: string) => Promise<void>;
  /**
   * コピー状態を手動でリセットする関数
   */
  resetCopied: () => void;
}

/**
 * クリップボードコピー機能を提供するカスタムフック
 *
 * @param options オプション設定
 * @returns コピー状態とコピー関数
 *
 * @example
 * ```tsx
 * const { copied, copyToClipboard } = useClipboard();
 *
 * const handleCopy = () => {
 *   copyToClipboard('コピーしたいテキスト');
 * };
 *
 * return (
 *   <button onClick={handleCopy}>
 *     {copied ? 'コピーしました!' : 'コピー'}
 *   </button>
 * );
 * ```
 */
export const useClipboard = (
  options: UseClipboardOptions = {}
): UseClipboardReturn => {
  const { resetTime = 2000, onSuccess, onError } = options;
  const [copied, setCopied] = useState(false);

  const copyToClipboard = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        onSuccess?.(text);

        // 指定時間後に状態をリセット
        setTimeout(() => {
          setCopied(false);
        }, resetTime);
      } catch (error) {
        const err =
          error instanceof Error
            ? error
            : new Error('クリップボードへのコピーに失敗しました');
        console.error('コピーに失敗しました:', err);
        onError?.(err);
      }
    },
    [resetTime, onSuccess, onError]
  );

  const resetCopied = useCallback(() => {
    setCopied(false);
  }, []);

  return {
    copied,
    copyToClipboard,
    resetCopied,
  };
};
