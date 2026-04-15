import { useEffect, useState } from "react";
import type { FormEvent, MouseEvent } from "react";
import type {
  ActionFunctionArgs,
} from "react-router";
import { useActionData, useLoaderData, useNavigation, useSubmit } from "react-router";

import {
  getRegistrationDefaults,
  saveRegistration,
  validateRegistration,
  type RegistrationFormErrors,
  type RegistrationFormState,
} from "../models/registration.server";

type ActionData = {
  errors?: RegistrationFormErrors;
  form?: RegistrationFormState;
  success?: boolean;
};

export async function loader() {
  return {
    form: getRegistrationDefaults(),
  };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const data: RegistrationFormState = {
    name: String(formData.get("name") || ""),
    email: String(formData.get("email") || ""),
    phone: String(formData.get("phone") || ""),
    orderNumber: String(formData.get("orderNumber") || ""),
    kitRegistrationNumber: String(formData.get("kitRegistrationNumber") || ""),
  };

  const errors = validateRegistration(data);

  if (errors) {
    return new Response(JSON.stringify({ errors }), {
      status: 422,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  await saveRegistration(data);

  return {
    success: true,
    form: getRegistrationDefaults(),
  };
}

export default function RegisterForm() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData() as ActionData | undefined;
  const navigation = useNavigation();
  const submit = useSubmit();
  const initialFormState = loaderData.form;
  const [formState, setFormState] = useState<RegistrationFormState>(initialFormState);
  const errors = actionData?.errors || {};
  const isSubmitting = navigation.state === "submitting";

  function updateField<K extends keyof RegistrationFormState>(field: K, value: RegistrationFormState[K]) {
    setFormState((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSave(event: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    submit(formState, { method: "post" });
  }

  function handleReset() {
    setFormState(initialFormState);
  }

  useEffect(() => {
    if (actionData?.success) {
      setFormState(actionData.form ?? loaderData.form);
    }
  }, [actionData, loaderData.form]);

  return (
    <form onSubmit={handleSave} onReset={handleReset}>
      <s-page heading="Register your test kit">
        <s-section heading="Customer information">
          <div
            style={{
              display: "grid",
              gap: "16px",
              maxWidth: "640px",
            }}
          >
            <label>
              <div style={{ marginBottom: "6px", fontWeight: 600 }}>Name</div>
              <input
                name="name"
                value={formState.name}
                autoComplete="name"
                onChange={(event) => updateField("name", event.currentTarget.value)}
                style={{ width: "100%", minHeight: "42px", padding: "10px 12px" }}
              />
              {errors.name ? <div style={{ color: "#b42318", marginTop: "6px" }}>{errors.name}</div> : null}
            </label>

            <label>
              <div style={{ marginBottom: "6px", fontWeight: 600 }}>Email</div>
              <input
                name="email"
                type="email"
                value={formState.email}
                autoComplete="email"
                onChange={(event) => updateField("email", event.currentTarget.value)}
                style={{ width: "100%", minHeight: "42px", padding: "10px 12px" }}
              />
              {errors.email ? <div style={{ color: "#b42318", marginTop: "6px" }}>{errors.email}</div> : null}
            </label>

            <label>
              <div style={{ marginBottom: "6px", fontWeight: 600 }}>Phone</div>
              <input
                name="phone"
                type="tel"
                value={formState.phone}
                autoComplete="tel"
                onChange={(event) => updateField("phone", event.currentTarget.value)}
                style={{ width: "100%", minHeight: "42px", padding: "10px 12px" }}
              />
              {errors.phone ? <div style={{ color: "#b42318", marginTop: "6px" }}>{errors.phone}</div> : null}
            </label>

            <label>
              <div style={{ marginBottom: "6px", fontWeight: 600 }}>Order number</div>
              <input
                name="orderNumber"
                value={formState.orderNumber}
                autoComplete="off"
                onChange={(event) => updateField("orderNumber", event.currentTarget.value)}
                style={{ width: "100%", minHeight: "42px", padding: "10px 12px" }}
              />
              {errors.orderNumber ? <div style={{ color: "#b42318", marginTop: "6px" }}>{errors.orderNumber}</div> : null}
            </label>

            <label>
              <div style={{ marginBottom: "6px", fontWeight: 600 }}>Kit registration number</div>
              <input
                name="kitRegistrationNumber"
                value={formState.kitRegistrationNumber}
                autoComplete="off"
                onChange={(event) => updateField("kitRegistrationNumber", event.currentTarget.value)}
                style={{ width: "100%", minHeight: "42px", padding: "10px 12px" }}
              />
              {errors.kitRegistrationNumber ? (
                <div style={{ color: "#b42318", marginTop: "6px" }}>{errors.kitRegistrationNumber}</div>
              ) : null}
            </label>

            <div style={{ display: "flex", gap: "12px" }}>
              <s-button type="submit" variant="primary" {...(isSubmitting ? { loading: true } : {})}>
                Register kit
              </s-button>
              <s-button type="reset" variant="tertiary">
                Reset
              </s-button>
            </div>

            {actionData?.success ? (
              <div
                style={{
                  padding: "12px 14px",
                  borderRadius: "10px",
                  background: "#ecfdf3",
                  color: "#027a48",
                  fontWeight: 600,
                }}
              >
                Your kit has been successfully registered.
              </div>
            ) : null}
          </div>
        </s-section>
      </s-page>
    </form>
  );
}