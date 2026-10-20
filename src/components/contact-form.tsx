'use client'

const fieldClass = 'w-full border-b border-current bg-transparent py-2 outline-none normal-case'

export function ContactForm() {
  return (
    <form className="max-w-[78rem]" onSubmit={(event) => event.preventDefault()}>
      <div className="grid gap-x-6 gap-y-8 md:grid-cols-2">
        <label className="block">
          <span className="text-sm uppercase">First Name</span>
          <input className={fieldClass} name="firstName" autoComplete="given-name" />
        </label>
        <label className="block">
          <span className="text-sm uppercase">Last Name</span>
          <input className={fieldClass} name="lastName" autoComplete="family-name" />
        </label>
        <label className="block">
          <span className="text-sm uppercase">Phone</span>
          <input className={fieldClass} name="phone" type="tel" autoComplete="tel" />
        </label>
        <label className="block">
          <span className="text-sm uppercase">Email</span>
          <input className={fieldClass} name="email" type="email" autoComplete="email" />
        </label>
      </div>
      <label className="mt-8 block">
        <span className="sr-only">Message</span>
        <textarea
          name="message"
          rows={8}
          placeholder="Type your message here"
          className="min-h-52 w-full border border-current bg-transparent p-4 text-sm normal-case outline-none placeholder:text-current/50"
        />
      </label>
      <button type="submit" className="mt-6 text-[19px] uppercase">
        submit &gt;
      </button>
    </form>
  )
}
