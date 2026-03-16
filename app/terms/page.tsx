import Link from 'next/link';

export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-16 text-foreground">
            <h1 className="text-3xl font-bold mb-6">Kullanım Şartları (Terms of Service)</h1>
            <p className="mb-4">
                Vogo Dijital Ajans ("Şirket") tarafından işletilen web sitesine hoş geldiniz.
                Bu siteyi kullanarak aşağıdaki şartları kabul etmiş olursunuz.
            </p>
            <h2 className="text-xl font-bold mt-4 mb-2">1. Hizmet Kullanımı</h2>
            <p className="mb-4">
                Web sitemizdeki içerikler, yalnızca bilgilendirme ve hizmet tanıtımı amaçlıdır.
                İçeriklerin izinsiz kopyalanması yasaktır.
            </p>
            <Link href="/" className="text-emerald-500 hover:underline">Anasayfaya Dön</Link>
        </div>
    );
}
