// 画面サイズに応じて表示される改行コンポーネント

// スマホでのみ改行
export const SmBreak = () => <br className="block sm:hidden" />;

// タブレット以上でのみ改行
export const MdBreak = () => <br className="hidden md:block" />;

// デスクトップでのみ改行
export const LgBreak = () => <br className="hidden lg:block" />;

// スマホとタブレットで改行（デスクトップでは非表示）
export const SmMdBreak = () => <br className="block lg:hidden" />;

// タブレット以下で改行（デスクトップでは非表示）
export const MdDownBreak = () => <br className="block lg:hidden" />;

// デスクトップ以上で改行（タブレット以下では非表示）
export const LgUpBreak = () => <br className="hidden lg:block" />;

// 逆パターン：スマホでは非表示、タブレット以上で改行
export const SmHiddenBreak = () => <br className="hidden sm:block" />;

// 逆パターン：タブレットでは非表示、スマホとデスクトップで改行
export const MdHiddenBreak = () => <br className="block md:hidden lg:block" />;
