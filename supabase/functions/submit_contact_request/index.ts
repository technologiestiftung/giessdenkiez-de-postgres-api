import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("URL");
const SUPABASE_ANON_KEY = Deno.env.get("ANON_KEY");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY");

const handler = async (_request: Request): Promise<Response> => {
	const { userContactName } = await _request.json();
	console.log(userContactName);

	const authHeader = _request.headers.get("Authorization")!;
	const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
		global: { headers: { Authorization: authHeader } },
	});

	const token = authHeader.replace("Bearer ", "");
	const { data: authData } = await supabaseClient.auth.getUser(token);
	console.log(authData);

	const supabaseServiceRoleClient = createClient(
		SUPABASE_URL,
		SUPABASE_SERVICE_ROLE_KEY,
		{
			global: { headers: { Authorization: authHeader } },
		}
	);

	const { data: contactData, error: contactError } =
		await supabaseServiceRoleClient
			.from("profiles")
			.select("*")
			.eq("username", userContactName)
			.single();
	console.log(JSON.stringify(contactData), JSON.stringify(contactError));

	const { data: fullContactData, error: fullContactError } =
		await supabaseClient
			.from("users_view")
			.select("email")
			.eq("id", contactData.id)
			.single();
	console.log(fullContactData, fullContactError);

	const { data, error } = await supabaseClient
		.from("contact_requests")
		.insert({
			user_id: authData.user.id,
			contact_id: contactData.id,
			contact_message: "Hallo wie gehts?",
		})
		.select("*")
		.single();

	console.log(data, error);

	// const res = await fetch("https://api.resend.com/emails", {
	// 	method: "POST",
	// 	headers: {
	// 		"Content-Type": "application/json",
	// 		Authorization: `Bearer ${RESEND_API_KEY}`,
	// 	},
	// 	body: JSON.stringify({
	// 		from: "onboarding@resend.dev",
	// 		to: "jonas.jaszkowic@ts.berlin",
	// 		subject:
	// 			"Deine Kontaktanfrage wurde bestätigt / Your request was confirmed",
	// 		html: `
	//     <!DOCTYPE html>
	//     <html lang="de">
	//       <head>
	//         <meta charset="UTF-8" />
	//       </head>
	//       <body>
	//         <table
	//           width="100%"
	//           style="
	//             font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;
	//             -webkit-box-sizing: border-box;
	//             box-sizing: border-box;
	//             width: 100%;
	//             margin: 0;
	//             padding: 0;
	//             background-color: #f2f4f6;
	//           "
	//           class="email-wrapper"
	//           cellspacing="0"
	//           cellpadding="0"
	//           bgcolor="#F2F4F6"
	//         >
	//           <tbody>
	//             <tr>
	//               <td
	//                 style="
	//                   font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;
	//                   -webkit-box-sizing: border-box;
	//                   box-sizing: border-box;
	//                 "
	//                 align="center"
	//               >
	//                 <table
	//                   width="100%"
	//                   style="
	//                     font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;
	//                     -webkit-box-sizing: border-box;
	//                     box-sizing: border-box;
	//                     width: 100%;
	//                     margin: 0;
	//                     padding: 0;
	//                   "
	//                   class="email-content"
	//                   cellspacing="0"
	//                   cellpadding="0"
	//                 >
	//                   <tbody>
	//                     <tr>
	//                       <td
	//                         style="
	//                           font-family: Arial, 'Helvetica Neue', Helvetica,
	//                             sans-serif;
	//                           -webkit-box-sizing: border-box;
	//                           box-sizing: border-box;
	//                           padding: 25px 0;
	//                           text-align: center;
	//                         "
	//                         class="email-masthead"
	//                         align="center"
	//                       >
	//                         <a
	//                           style="
	//                             font-family: Arial, 'Helvetica Neue', Helvetica,
	//                               sans-serif;
	//                             -webkit-box-sizing: border-box;
	//                             box-sizing: border-box;
	//                             font-size: 16px;
	//                             font-weight: bold;
	//                             color: #2f3133;
	//                             text-decoration: none;
	//                             text-shadow: 0 1px 0 white;
	//                           "
	//                           href="https://giessdenkiez.de/"
	//                           class="email-masthead_name"
	//                         >
	//                           <img
	//                             style="
	//                               font-family: Arial, 'Helvetica Neue', Helvetica,
	//                                 sans-serif;
	//                               -webkit-box-sizing: border-box;
	//                               box-sizing: border-box;
	//                               max-height: 50px;
	//                             "
	//                             src="https://www.giessdenkiez.de/images/icon-trees.svg"
	//                             class="email-logo"
	//                             alt=""
	//                           />
	//                         </a>
	//                       </td>
	//                     </tr>

	//                     <tr>
	//                       <td
	//                         width="100%"
	//                         style="
	//                           font-family: Arial, 'Helvetica Neue', Helvetica,
	//                             sans-serif;
	//                           -webkit-box-sizing: border-box;
	//                           box-sizing: border-box;
	//                           width: 100%;
	//                           margin: 0;
	//                           padding: 0;
	//                           border-top: 1px solid #edeff2;
	//                           border-bottom: 1px solid #edeff2;
	//                           background-color: #fff;
	//                         "
	//                         class="email-body"
	//                         bgcolor="#FFF"
	//                       >
	//                         <table
	//                           width="570"
	//                           style="
	//                             font-family: Arial, 'Helvetica Neue', Helvetica,
	//                               sans-serif;
	//                             -webkit-box-sizing: border-box;
	//                             box-sizing: border-box;
	//                             width: 570px;
	//                             margin: 0 auto;
	//                             padding: 0;
	//                           "
	//                           class="email-body_inner"
	//                           cellspacing="0"
	//                           cellpadding="0"
	//                           align="center"
	//                         >
	//                           <tbody>
	//                             <tr>
	//                               <td
	//                                 style="
	//                                   font-family: Arial, 'Helvetica Neue', Helvetica,
	//                                     sans-serif;
	//                                   -webkit-box-sizing: border-box;
	//                                   box-sizing: border-box;
	//                                   padding: 35px 35px 0px 35px;
	//                                 "
	//                                 class="content-cell"
	//                               >
	//                                 <p>
	//                                   * * * For the English version of this email,
	//                                   please see below. * * *
	//                                 </p>
	//                                 <h1
	//                                   style="
	//                                     margin-top: 0;
	//                                     color: #2f3133;
	//                                     font-size: 19px;
	//                                     font-weight: bold;
	//                                     font-family: Arial, 'Helvetica Neue', Helvetica,
	//                                       sans-serif;
	//                                     -webkit-box-sizing: border-box;
	//                                     box-sizing: border-box;
	//                                   "
	//                                 >
	//                                   Gieß den
	//                                   <span style="color: #37de8a">Kiez</span>
	//                                 </h1>

	//                                 <p
	//                                   style="
	//                                     margin-top: 0;
	//                                     color: #000;
	//                                     font-size: 16px;
	//                                     line-height: 1.5em;
	//                                     font-family: Arial, 'Helvetica Neue', Helvetica,
	//                                       sans-serif;
	//                                     -webkit-box-sizing: border-box;
	//                                     box-sizing: border-box;
	//                                   "
	//                                 >
	//                                   Deine Kontaktanfrage wurde bestätigt. Hier ist die
	//                                   E-Mail-Adresse des Gieß den Kiez Users:
	//                                   <a href="mailto:jonas.jaszkowic@ts.berlin"
	//                                     >jonas.jaszkowic@ts.berlin</a
	//                                   >.
	//                                 </p>

	//                                 <p
	//                                   style="
	//                                     margin-top: 0;
	//                                     color: #000;
	//                                     padding: 1rem 0 0 0;
	//                                     font-size: 14px;
	//                                     line-height: 1.5em;
	//                                     font-family: Arial, 'Helvetica Neue', Helvetica,
	//                                       sans-serif;
	//                                     -webkit-box-sizing: border-box;
	//                                     box-sizing: border-box;
	//                                   "
	//                                 >
	//                                   <i
	//                                     style="
	//                                       font-family: Arial, 'Helvetica Neue',
	//                                         Helvetica, sans-serif;
	//                                       -webkit-box-sizing: border-box;
	//                                       box-sizing: border-box;
	//                                     "
	//                                   >
	//                                     Gieß den Kiez ist eine Anwendung, die hilft,
	//                                     ehrenamtliches Engagement beim Gießen durstiger
	//                                     Stadtbäume zu koordinieren. Gieß den Kiez ist
	//                                     ein Projekt der
	//                                     <a
	//                                       style="color: unset"
	//                                       href="https://www.technologiestiftung-berlin.de/"
	//                                       >Technologiestiftung Berlin</a
	//                                     >
	//                                     und wird vom
	//                                     <a
	//                                       style="color: unset"
	//                                       href="https://citylab-berlin.org/"
	//                                       >CityLAB Berlin</a
	//                                     >
	//                                     entwickelt.
	//                                   </i>
	//                                 </p>

	//                                 <br />
	//                                 <hr style="width: 100%; border-bottom: 1px" />
	//                                 <br />

	//                                 <h1
	//                                   style="
	//                                     margin-top: 0;
	//                                     color: #2f3133;
	//                                     font-size: 19px;
	//                                     font-weight: bold;
	//                                     font-family: Arial, 'Helvetica Neue', Helvetica,
	//                                       sans-serif;
	//                                     -webkit-box-sizing: border-box;
	//                                     box-sizing: border-box;
	//                                   "
	//                                 >
	//                                   Gieß den
	//                                   <span style="color: #37de8a">Kiez</span>
	//                                 </h1>

	//                                 <p
	//                                   style="
	//                                     margin-top: 0;
	//                                     color: #000;
	//                                     font-size: 16px;
	//                                     line-height: 1.5em;
	//                                     font-family: Arial, 'Helvetica Neue', Helvetica,
	//                                       sans-serif;
	//                                     -webkit-box-sizing: border-box;
	//                                     box-sizing: border-box;
	//                                   "
	//                                 >
	//                                   Your request was confirmed. This is the email
	//                                   address of the Gieß den Kiez user:
	//                                   <a href="mailto:jonas.jaszkowic@ts.berlin"
	//                                     >jonas.jaszkowic@ts.berlin</a
	//                                   >.
	//                                 </p>

	//                                 <p
	//                                   style="
	//                                     margin-top: 0;
	//                                     color: #000;
	//                                     padding: 1rem 0 0 0;
	//                                     font-size: 14px;
	//                                     line-height: 1.5em;
	//                                     font-family: Arial, 'Helvetica Neue', Helvetica,
	//                                       sans-serif;
	//                                     -webkit-box-sizing: border-box;
	//                                     box-sizing: border-box;
	//                                   "
	//                                 >
	//                                   <i
	//                                     style="
	//                                       font-family: Arial, 'Helvetica Neue',
	//                                         Helvetica, sans-serif;
	//                                       -webkit-box-sizing: border-box;
	//                                       box-sizing: border-box;
	//                                     "
	//                                   >
	//                                     Gieß den Kiez is an application that helps to
	//                                     coordinate volunteer engagement to water thirsty
	//                                     urban trees. Gieß den Kiez is a project of the
	//                                     <a
	//                                       style="color: unset"
	//                                       href="https://www.technologiestiftung-berlin.de/"
	//                                       >Technology Foundation Berlin</a
	//                                     >
	//                                     and is being developed by
	//                                     <a
	//                                       style="color: unset"
	//                                       href="https://citylab-berlin.org/"
	//                                       >CityLAB Berlin</a
	//                                     >.
	//                                   </i>
	//                                 </p>

	//                                 <p
	//                                   style="
	//                                     margin-top: 0;
	//                                     color: #74787e;
	//                                     font-size: 13px;
	//                                     line-height: 1em;
	//                                     font-family: Arial, 'Helvetica Neue', Helvetica,
	//                                       sans-serif;
	//                                     -webkit-box-sizing: border-box;
	//                                     box-sizing: border-box;
	//                                     padding-top: 1rem;
	//                                   "
	//                                 >
	//                                   Technologiestiftung Berlin
	//                                   <br />
	//                                   Grunewaldstraße 61-62
	//                                   <br />
	//                                   10825 Berlin
	//                                   <br />
	//                                   Tel.:
	//                                   <a style="color: unset" href="tel:+493020969990"
	//                                     >+49 30 209 69 99 0</a
	//                                   >
	//                                   <br />
	//                                   <a
	//                                     style="color: unset"
	//                                     href="mailto:info@technologiestiftung-berlin.de"
	//                                     >info@technologiestiftung-berlin.de</a
	//                                   >
	//                                   <br />
	//                                   <br />
	//                                 </p>
	//                               </td>
	//                             </tr>
	//                           </tbody>
	//                         </table>
	//                       </td>
	//                     </tr>

	//                     <tr>
	//                       <td
	//                         style="
	//                           font-family: Arial, 'Helvetica Neue', Helvetica,
	//                             sans-serif;
	//                           -webkit-box-sizing: border-box;
	//                           box-sizing: border-box;
	//                         "
	//                       >
	//                         <table
	//                           width="570"
	//                           style="
	//                             font-family: Arial, 'Helvetica Neue', Helvetica,
	//                               sans-serif;
	//                             -webkit-box-sizing: border-box;
	//                             box-sizing: border-box;
	//                             width: 570px;
	//                             margin: 0 auto;
	//                             padding: 0;
	//                             text-align: center;
	//                           "
	//                           class="email-footer"
	//                           cellspacing="0"
	//                           cellpadding="0"
	//                           align="center"
	//                         >
	//                           <tbody>
	//                             <tr>
	//                               <td
	//                                 style="
	//                                   font-family: Arial, 'Helvetica Neue', Helvetica,
	//                                     sans-serif;
	//                                   -webkit-box-sizing: border-box;
	//                                   box-sizing: border-box;
	//                                   padding: 35px;
	//                                 "
	//                                 class="content-cell"
	//                               >
	//                                 <p
	//                                   style="
	//                                     margin-top: 0;
	//                                     line-height: 1.5em;
	//                                     font-family: Arial, 'Helvetica Neue', Helvetica,
	//                                       sans-serif;
	//                                     -webkit-box-sizing: border-box;
	//                                     box-sizing: border-box;
	//                                     color: #aeaeae;
	//                                     font-size: 12px;
	//                                     text-align: center;
	//                                   "
	//                                   class="sub center"
	//                                 >
	//                                   Du bekommst diese Nachricht, weil Du Dir auf
	//                                   <a
	//                                     style="color: unset"
	//                                     href="https://www.giessdenkiez.de"
	//                                     >giessdenkiez.de</a
	//                                   >
	//                                   mit dieser E-Mail einen Account anlegen wolltest.
	//                                 </p>
	//                               </td>
	//                             </tr>
	//                           </tbody>
	//                         </table>
	//                       </td>
	//                     </tr>
	//                   </tbody>
	//                 </table>
	//               </td>
	//             </tr>
	//           </tbody>
	//         </table>
	//       </body>
	//     </html>
	//     `,
	// 	}),
	// });

	// const emailData = await res.json();
	// console.log(emailData);

	return new Response(JSON.stringify(""), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	});
};

Deno.serve(handler);

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/resend' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
