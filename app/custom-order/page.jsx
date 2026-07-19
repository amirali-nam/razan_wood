import CustomOrderForm from '@/components/CustomOrderForm';

export const metadata = {
  title: 'محصول سفارشی',
  description: 'طرح دلخواه‌تان را ثبت کنید — رزان آن را با دست روی چوب گردو می‌سازد.',
};

export default function CustomOrderPage() {
  return (
    <>
      <div className="page-head">
        <h1>سفارش طرح دلخواه</h1>
        <p>
          محصولی با طراحی خاص در نظر دارید؟ فرم زیر را پر کنید؛ پیام آماده می‌شود و با
          یک کلیک به واتساپ یا دایرکت رزان می‌رود.
        </p>
      </div>
      <section style={{ paddingTop: 28 }}>
        <div className="container">
          <CustomOrderForm />
        </div>
      </section>
    </>
  );
}
