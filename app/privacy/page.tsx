import Link from 'next/link';

export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-16 text-foreground">
            <h1 className="text-3xl font-bold mb-6">Gizlilik Politikası (Privacy Policy)</h1>
            <p className="mb-4">
                Vogo Dijital Ajans olarak gizliliğinize önem veriyoruz. Bu politika, kişisel verilerinizin nasıl toplandığını ve kullanıldığını açıklar.
            </p>
            <h2 className="text-xl font-bold mt-4 mb-2">1. Veri Toplama</h2>
            <p className="mb-4">
                Sitemizi kullanırken, iletişim formları aracılığıyla sağladığınız ad, e-posta gibi bilgileri toplayabiliriz.
            </p>
            <Link href="/" className="text-emerald-500 hover:underline">Anasayfaya Dön</Link>
        </div>
    );
}
