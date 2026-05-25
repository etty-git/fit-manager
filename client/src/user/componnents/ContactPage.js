import MessageCenter from "../../common/MessageCenter";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950">
      <div className="mx-auto max-w-6xl">
        <MessageCenter title="Member Messages" defaultRole="admin" />
      </div>
    </div>
  );
}
