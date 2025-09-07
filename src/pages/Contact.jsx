import Navbar from "@/components/Navbar";
import React, { useState } from "react";

export default function Contact() {
    const [form, setForm] = useState({ name: "", email: "", message: "" });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // 🚀 You can integrate backend or email service here
        console.log("Form submitted:", form);
        alert("Thank you! We’ll get back to you soon.");
        setForm({ name: "", email: "", message: "" });
    };

    return (
        <div><Navbar />
            <div className="max-w-3xl mx-auto p-6 space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
                <p className="text-gray-700 text-lg">
                    Have questions, feedback, or partnership ideas? Fill out the form below
                    or reach out directly via email or LinkedIn.
                </p>

                {/* Contact Form */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-4 bg-white shadow-md p-6 rounded-2xl"
                >
                    <div>
                        <label className="block text-gray-700 font-medium">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">Message</label>
                        <textarea
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            required
                            rows="4"
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Send Message
                    </button>
                </form>

                {/* Direct Contact Info */}
                <div className="space-y-2 text-lg text-gray-700">
                    <p>
                        📧 Email:{" "}
                        <a
                            href="mailto:rajeshmn47@gmail.com"
                            className="text-blue-600 underline"
                        >
                            rajeshmn47@gmail.com
                        </a>
                    </p>
                    <p>
                        🔗 LinkedIn:{" "}
                        <a
                            href="https://www.linkedin.com/company/107785386/admin/dashboard/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                        >
                            Connect with us
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
