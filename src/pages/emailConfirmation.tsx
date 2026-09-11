export const EmailConfirmation = () => {
  return (
    <div>
      <h1>Email Confirmation</h1>
      <h3 className="text-white text-lg mb-4">
        You have successfully signed up!
      </h3>
      <p className="text-white text-md mb-4">
        Please check your email to confirm your email address.
      </p>
      <p className="text-white text-md mb-4">
        Once you have confirmed your email, you can start using MyCalendly by
        logging in to your account.
      </p>
      <p className="text-white text-md text-yellow-300 p-4">
        If you did not receive the email, please check your spam folder or
        request a new confirmation email.
      </p>
    </div>
  );
};
