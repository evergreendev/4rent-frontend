"use client"
import {sendMail} from "@/app/services/aws-ses";
import {useFormState} from 'react-dom'
import React from "react";

const initialState = {
    message: "",
    error: ""
}

const ContactForm = () => {
    const [state, formAction] = useFormState(sendMail, initialState);

    return <>
        {state?.message
            ? <p className="text-2xl mt-24 text-center">{state.message}</p>
            : <form action={formAction}>
                <div className="flex flex-wrap gap-2 mb-4 mt-14">
                    <div className="flex-col flex grow">
                        <label htmlFor="firstName">First Name <span className="text-red-600">*</span></label>
                        <input className="border-b-2 border-slate-300 shadow-sm" type="text" id="firstName"
                               name="firstName"
                               required/>
                    </div>
                    <div className="flex-col flex grow">
                        <label htmlFor="lastName">Last Name <span className="text-red-600">*</span></label>
                        <input className="border-b-2 border-slate-300 shadow-sm" type="text" id="lastName"
                               name="lastName"
                               required/>
                    </div>
                </div>
                <div className="flex-col flex mb-4">
                    <label htmlFor="phone">Phone <span className="text-red-600">*</span></label>
                    <input className="border-b-2 border-slate-300 shadow-sm" type="text" id="phone" name="phone"
                           required/>
                </div>
                <div className="flex-col flex mb-4">
                    <label htmlFor="email">Email <span className="text-red-600">*</span></label>
                    <input className="border-b-2 border-slate-300 shadow-sm" type="text" id="email" name="email"
                           required/>
                </div>
                <div className="flex-col flex mb-4">
                    <label htmlFor="website">Property Name</label>
                    <input className="border-b-2 border-slate-300 shadow-sm" id="website" name="propertyName"
                    />
                </div>
                <p className="text-red-600">
                    {state?.error}
                </p>
                <button className="bg-red-500 text-white py-1 px-6 rounded font-bold">Submit</button>
            </form>}
    </>

}

export default ContactForm;
