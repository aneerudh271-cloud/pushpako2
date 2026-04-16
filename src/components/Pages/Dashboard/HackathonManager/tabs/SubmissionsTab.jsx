'use client';
import { useState, useEffect } from 'react';
import { ExternalLink, FileText, Mail, X, Download, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

export default function SubmissionsTab() {
    const [hackathons, setHackathons] = useState([]);
    const [selectedHackathon, setSelectedHackathon] = useState('');
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [emailSubject, setEmailSubject] = useState('');
    const [emailMessage, setEmailMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [previewContent, setPreviewContent] = useState('');

    useEffect(() => {
        fetchHackathons();
    }, []);

    useEffect(() => {
        if (selectedHackathon) {
            fetchSubmissions();
        }
    }, [selectedHackathon]);

    const fetchHackathons = async () => {
        try {
            const response = await fetch('/api/hackathons');
            const data = await response.json();
            if (response.ok) {
                setHackathons(data.hackathons);
            }
        } catch (error) {
            toast.error('Failed to fetch hackathons');
        }
    };

    const fetchSubmissions = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/submissions?hackathonId=${selectedHackathon}`);
            const data = await response.json();
            if (response.ok) {
                setSubmissions(data.submissions);
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error('Failed to fetch submissions');
        } finally {
            setLoading(false);
        }
    };

    const openEmailModal = (submission) => {
        setSelectedSubmission(submission);
        setEmailSubject(`Acknowledgment for your submission to ${hackathons.find(h => h._id === selectedHackathon)?.title || 'Hackathon'}`);
        setEmailMessage(`Dear ${submission.participation?.user?.name || 'Participant'},\n\nThank you for your submission to our hackathon.\n\nBest regards,\nPushpak O2 Team`);
        setShowEmailModal(true);
    };

    const handleSendEmail = async () => {
        if (!emailSubject.trim() || !emailMessage.trim()) {
            toast.error('Subject and message are required');
            return;
        }

        setSending(true);
        try {
            const response = await fetch('/api/submissions/send-acknowledgment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    submissionId: selectedSubmission._id,
                    participantEmail: selectedSubmission.participation?.user?.email,
                    participantName: selectedSubmission.participation?.user?.name,
                    subject: emailSubject,
                    message: emailMessage
                })
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Acknowledgment email sent successfully');
                setShowEmailModal(false);
                setEmailSubject('');
                setEmailMessage('');
            } else {
                toast.error(data.error || 'Failed to send email');
            }
        } catch (error) {
            toast.error('Failed to send email');
        } finally {
            setSending(false);
        }
    };

    const handleDownloadMarkdown = (submission) => {
        const element = document.createElement("a");
        const file = new Blob([submission.markdownFile], { type: 'text/markdown' });
        element.href = URL.createObjectURL(file);
        element.download = `${submission.participation?.user?.name.replace(/\s+/g, '_')}_submission.md`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const openPreviewModal = (content) => {
        setPreviewContent(content);
        setShowPreviewModal(true);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Submissions</h2>

            <div className="mb-6">
                <select
                    value={selectedHackathon}
                    onChange={(e) => setSelectedHackathon(e.target.value)}
                    className="w-full md:w-64 p-2 bg-gray-600 rounded"
                >
                    <option value="">Select Hackathon</option>
                    {hackathons.map((hackathon) => (
                        <option key={hackathon._id} value={hackathon._id}>
                            {hackathon.title}
                        </option>
                    ))}
                </select>
            </div>

            {selectedHackathon && (
                <div className="overflow-x-auto">
                    <table className="w-full bg-gray-700 rounded-lg">
                        <thead>
                            <tr className="bg-gray-600">
                                <th className="p-3 text-left">Participant</th>
                                <th className="p-3 text-left">Email</th>
                                <th className="p-3 text-left">Markdown File</th>
                                <th className="p-3 text-left">GitHub Repo</th>
                                <th className="p-3 text-left">Demo Link</th>
                                <th className="p-3 text-left">Submitted At</th>
                                <th className="p-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="p-3 text-center">Loading...</td>
                                </tr>
                            ) : submissions.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="p-3 text-center">No submissions found</td>
                                </tr>
                            ) : (
                                submissions.map((submission) => (
                                    <tr key={submission._id} className="border-t border-gray-600">
                                        <td className="p-3">{submission.participation?.user?.name || 'N/A'}</td>
                                        <td className="p-3">{submission.participation?.user?.email || 'N/A'}</td>
                                        <td className="p-3">
                                            {submission.markdownFile ? (
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => openPreviewModal(submission.markdownFile)}
                                                        className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-xs bg-blue-400/10 px-2 py-1 rounded"
                                                        title="View Content"
                                                    >
                                                        <Eye size={14} />
                                                        Preview
                                                    </button>
                                                    <button
                                                        onClick={() => handleDownloadMarkdown(submission)}
                                                        className="text-green-400 hover:text-green-300 flex items-center gap-1 text-xs bg-green-400/10 px-2 py-1 rounded"
                                                        title="Download .md file"
                                                    >
                                                        <Download size={14} />
                                                        Download
                                                    </button>
                                                </div>
                                            ) : (
                                                'N/A'
                                            )}
                                        </td>
                                        <td className="p-3">
                                            {submission.githubRepo ? (
                                                <a
                                                    href={submission.githubRepo}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                                                >
                                                    <ExternalLink size={16} />
                                                    GitHub
                                                </a>
                                            ) : (
                                                'N/A'
                                            )}
                                        </td>
                                        <td className="p-3">
                                            {submission.demoLink ? (
                                                <a
                                                    href={submission.demoLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                                                >
                                                    <ExternalLink size={16} />
                                                    Demo
                                                </a>
                                            ) : (
                                                'N/A'
                                            )}
                                        </td>
                                        <td className="p-3">{new Date(submission.submittedAt).toLocaleDateString()}</td>
                                        <td className="p-3">
                                            <button
                                                onClick={() => openEmailModal(submission)}
                                                className="text-blue-400 hover:text-blue-300 cursor-pointer transition-colors"
                                                title="Send Acknowledgment Email"
                                            >
                                                <Mail size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Email Modal */}
            {showEmailModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-gray-800 w-full max-w-2xl rounded-xl border border-gray-700 shadow-2xl">
                        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                            <h3 className="text-xl font-bold">Send Acknowledgment Email</h3>
                            <button
                                onClick={() => setShowEmailModal(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">To:</label>
                                <input
                                    type="email"
                                    value={selectedSubmission?.participation?.user?.email || ''}
                                    disabled
                                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-400"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Subject:</label>
                                <input
                                    type="text"
                                    value={emailSubject}
                                    onChange={(e) => setEmailSubject(e.target.value)}
                                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 outline-none transition-all"
                                    placeholder="Enter email subject"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Message:</label>
                                <textarea
                                    value={emailMessage}
                                    onChange={(e) => setEmailMessage(e.target.value)}
                                    rows={10}
                                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 outline-none transition-all resize-none"
                                    placeholder="Enter your message"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={handleSendEmail}
                                    disabled={sending}
                                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {sending ? 'Sending...' : 'Send Email'}
                                </button>
                                <button
                                    onClick={() => setShowEmailModal(false)}
                                    className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg font-medium transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Markdown Preview Modal */}
            {showPreviewModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
                    <div className="bg-gray-800 w-full max-w-4xl max-h-[90vh] rounded-2xl border border-gray-700 shadow-2xl flex flex-col">
                        <div className="p-6 border-b border-gray-700 flex justify-between items-center shrink-0">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <FileText className="text-blue-400" />
                                Submission Preview
                            </h3>
                            <button
                                onClick={() => setShowPreviewModal(false)}
                                className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-all"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-8 overflow-y-auto custom-scrollbar">
                            <div className="prose prose-invert max-w-none prose-headings:text-blue-400 prose-a:text-blue-400 prose-strong:text-white">
                                <ReactMarkdown>{previewContent}</ReactMarkdown>
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-700 bg-gray-900/50 flex justify-end shrink-0">
                            <button
                                onClick={() => setShowPreviewModal(false)}
                                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-all"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}