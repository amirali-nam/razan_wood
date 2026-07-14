import CustomOrderForm from '@/components/CustomOrderForm';

export const metadata = {
  title: 'سفارش سفارشی',
  description: 'طرح دلخواه‌تان را ثبت کنید — رزان آن را با دست روی چوب گردو می‌سازد.',
};

export default function CustomOrderPage() {
  return (
    <>
      <div className="page-head">
        <h1>سفارش طرح دلخواه</h1>
        <p>
          چیزی در ذهن دارید که در محصولات نیست؟ فرم زیر را پر کنید؛ پیام آماده می‌شود و با
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
