export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-red-100">
            <h1 className="text-4xl font-bold text-red-600">Zugriff verweigert</h1>
            <p className="text-lg mt-4">Sie haben keinen Zugriff auf diese Seite.</p>
            <a href="/" className="mt-6 px-4 py-2 bg-blue-600 text-white rounded">
                Zurück zur Startseite
            </a>
        </div>
    );
}
