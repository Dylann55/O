interface IProfile {
  id: string;
  role: string;
  username?: string;
  avatarUrl?: string;
  fullName?: string;
  email: string;
  professions?: Array<IProfession> | any[];
  linkedinUrl?: string;
  youtubeUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  tiktokUrl?: string;
  twitchUrl?: string;
  whatsappUrl?: string;
  websiteUrl?: string;
  phone?: string;
  roles?: Array<IRole> | any[];
  organizations?: Array<IOrganization> | any[];
}

interface IProfession {
  id: string;
  name: string;
  created_at: string;
}

interface IRole {
  id: string;
  name: string;
}

interface IOrganization {
  id: string;
  name: string;
  parent_organization_unit_id: string;
  parent_organization_id: string;
}

export default function UserInfo(person: IProfile) {
  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
      <div
        key={person.fullName}
        className="rounded-lg bg-uta-primary py-10 px-6 text-center "
      >
        <div className="flex">
          <div className="shrink-0 sm:mb-0 sm:mr-4">
            <img
              className="h-36 w-36 rounded-full"
              src={person.avatarUrl /* cprofile.avatar_url */}
              width={200}
              alt="avatar"
            />
          </div>
          <div className="text-left">
            <div className="my-2">
              <h4 className="text-lg font-bold text-white">
                {person.fullName}
              </h4>
              {person.professions ? (
                <>
                  <h3 className="text-uta-tertiary">
                    {person.professions.map((profession) => {
                      return (
                        <span
                          key={profession.id}
                          className="mr-2 mt-2 inline-block shrink-0 rounded bg-uta-secondary px-2 py-0.5 text-xs font-medium text-white"
                        >
                          {profession.name}
                        </span>
                      );
                    })}
                  </h3>
                </>
              ) : (
                <h3 className="text-uta-tertiary">Profesión sin definir</h3>
              )}

              {person.organizations ? (
                <>
                  <h3 className="text-uta-tertiary">
                    {person.organizations.map((organization, index) => {
                      return (
                        <>
                          {index === 0 ? '' : <span className="mr-2">|</span>}

                          <span
                            key={organization.id}
                            className="mr-2 mt-2 inline-block shrink-0 rounded  py-0.5 text-xs font-medium text-white"
                          >
                            {organization.name}
                          </span>
                        </>
                      );
                    })}
                  </h3>
                </>
              ) : (
                <h3 className="text-uta-tertiary">Profesión sin definir</h3>
              )}

              <div className="my-2 flex">
                <ul role="list" className="flex justify-center space-x-5">
                  {person.linkedinUrl ? (
                    <li>
                      <a
                        href={person.linkedinUrl}
                        className="text-gray-400 hover:text-gray-300"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="sr-only">LinkedIn</span>
                        <svg
                          className="h-5 w-5"
                          aria-hidden="true"
                          fill="currentColor"
                          viewBox="0 0 82.75 82.75"
                        >
                          <path
                            d="m64.89,0H17.86C8.04,0,0,8.04,0,17.86v47.04c0,9.82,8.04,17.86,17.86,17.86h47.04c9.82,0,17.86-8.04,17.86-17.86V17.86c0-9.82-8.04-17.86-17.86-17.86ZM27.1,66.1h-10.8V31.34h10.8v34.76Zm-5.4-39.51c-3.46,0-6.26-2.8-6.26-6.26s2.8-6.27,6.26-6.27,6.26,2.81,6.26,6.27-2.81,6.26-6.26,6.26Zm45.87,39.51h-10.8v-16.9c0-4.03-.07-9.22-5.62-9.22s-6.48,4.4-6.48,8.93v17.19h-10.8V31.34h10.36v4.76h.15c1.44-2.74,4.97-5.61,10.22-5.61,10.94,0,12.96,7.2,12.96,16.55v19.06Z"
                            fill="currentColor"
                          />{' '}
                        </svg>
                      </a>
                    </li>
                  ) : (
                    ''
                  )}
                  {person.youtubeUrl ? (
                    <li>
                      <a
                        href={person.youtubeUrl}
                        className="text-gray-400 hover:text-gray-300"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="sr-only">Youtube</span>
                        <svg
                          className="h-5 w-5"
                          aria-hidden="true"
                          fill="currentColor"
                          viewBox="0 0 82.75 82.75"
                        >
                          <polygon
                            points="36.09 49.68 51.69 41.54 36.09 33.39 36.09 49.68"
                            fill="currentColor"
                          />
                          <path
                            d="m64.89,0H17.86C8.04,0,0,8.04,0,17.86v47.04c0,9.82,8.04,17.86,17.86,17.86h47.04c9.82,0,17.86-8.04,17.86-17.86V17.86c0-9.82-8.04-17.86-17.86-17.86Zm6.41,48.71c0,7.5-2.57,13.58-10.06,13.58H22.66c-7.5,0-10.86-6.08-10.86-13.58v-14.36c0-7.5,3.05-13.58,10.54-13.58h39.22c7.5,0,9.74,6.08,9.74,13.58v14.36Z"
                            fill="currentColor"
                          />{' '}
                        </svg>
                      </a>
                    </li>
                  ) : (
                    ''
                  )}
                  {person.facebookUrl ? (
                    <li>
                      <a
                        href={person.facebookUrl}
                        className="text-gray-400 hover:text-gray-300"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="sr-only">Facebook</span>
                        <svg
                          className="h-5 w-5"
                          id="a"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 82.75 82.75"
                        >
                          <path d="m64.89,0H17.86C8.04,0,0,8.04,0,17.86v47.04c0,9.82,8.04,17.86,17.86,17.86h15.94v-29.33h-11.35v-13.35h11.35v-9.69c0-11.25,6.86-17.37,16.9-17.37,4.81,0,8.93.36,10.13.52v11.96h-6.95c-5.45,0-6.51,2.6-6.51,6.4v8.18h13.01l-.03.21h.03l-1.69,13.14h-11.32v29.33h17.53c9.82,0,17.86-8.04,17.86-17.86V17.86c0-9.82-8.04-17.86-17.86-17.86Z" />
                        </svg>
                      </a>
                    </li>
                  ) : (
                    ''
                  )}
                  {person.instagramUrl ? (
                    <li>
                      <a
                        href={person.instagramUrl}
                        className="text-gray-400 hover:text-gray-300"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="sr-only">Instagram</span>
                        <svg
                          className="h-5 w-5"
                          id="a"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 82.75 82.75"
                        >
                          <path
                            d="m54.17,16.79h-25.59c-6.58,0-11.94,5.36-11.94,11.94v25.59c0,6.58,5.36,11.94,11.94,11.94h25.59c6.58,0,11.94-5.36,11.94-11.94v-25.59c0-6.58-5.36-11.94-11.94-11.94Zm-12.8,39.48c-8.13,0-14.74-6.61-14.74-14.74s6.61-14.74,14.74-14.74,14.74,6.61,14.74,14.74-6.61,14.74-14.74,14.74Zm15.86-27.7c-1.64,0-2.97-1.33-2.97-2.97s1.33-2.97,2.97-2.97,2.97,1.33,2.97,2.97-1.33,2.97-2.97,2.97Z"
                            fill="currentColor"
                          />
                          <path
                            d="m41.37,30.97c-5.82,0-10.55,4.73-10.55,10.55s4.73,10.55,10.55,10.55,10.55-4.73,10.55-10.55-4.73-10.55-10.55-10.55Z"
                            fill="currentColor"
                          />
                          <path
                            d="m64.89,0H17.86C8.04,0,0,8.04,0,17.86v47.04c0,9.82,8.04,17.86,17.86,17.86h47.04c9.82,0,17.86-8.04,17.86-17.86V17.86c0-9.82-8.04-17.86-17.86-17.86Zm5.45,53.88c0,9.08-7.39,16.47-16.47,16.47h-25.01c-9.08,0-16.47-7.39-16.47-16.47v-25c0-9.08,7.39-16.47,16.47-16.47h25.01c9.08,0,16.47,7.39,16.47,16.47v25Z"
                            fill="currentColor"
                          />
                        </svg>
                      </a>
                    </li>
                  ) : (
                    ''
                  )}

                  {person.twitterUrl ? (
                    <li>
                      <a
                        href={person.twitterUrl}
                        className="text-gray-400 hover:text-gray-300"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="sr-only">Twitter</span>
                        <svg
                          className="h-5 w-5"
                          aria-hidden="true"
                          fill="currentColor"
                          viewBox="0 0 82.75 82.75"
                        >
                          <path
                            d="m64.89,0H17.86C8.04,0,0,8.04,0,17.86v47.04c0,9.82,8.04,17.86,17.86,17.86h47.04c9.82,0,17.86-8.04,17.86-17.86V17.86c0-9.82-8.04-17.86-17.86-17.86Zm.67,30.59c.02.51.02,1.02.02,1.54-.23,15.75-12.48,33.73-34.4,33.41-6.73-.1-12.97-2.16-18.19-5.62.93.12,1.88.2,2.84.21,5.59.08,10.75-1.75,14.88-4.89-5.21-.17-9.56-3.68-11.01-8.44.73.15,1.47.23,2.24.24,1.09.02,2.14-.11,3.14-.37-5.43-1.17-9.47-6.05-9.39-11.82,0-.05,0-.1,0-.15,1.59.92,3.42,1.48,5.38,1.57-3.17-2.18-5.22-5.86-5.16-10,.03-2.18.65-4.22,1.7-5.97,5.77,7.3,14.49,12.17,24.38,12.81-.19-.88-.28-1.79-.27-2.72.1-6.58,5.51-11.84,12.09-11.74,3.43.05,6.51,1.54,8.65,3.89,2.72-.49,5.29-1.45,7.61-2.78-.93,2.77-2.86,5.08-5.34,6.52,2.42-.25,4.72-.86,6.87-1.78-1.63,2.37-3.68,4.44-6.04,6.09Z"
                            fill="currentColor"
                          />{' '}
                        </svg>
                      </a>
                    </li>
                  ) : (
                    ''
                  )}
                  {person.tiktokUrl ? (
                    <li>
                      <a
                        href={person.tiktokUrl}
                        className="text-gray-400 hover:text-gray-300"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="sr-only">TikTok</span>
                        <svg
                          className="h-5 w-5"
                          aria-hidden="true"
                          fill="currentColor"
                          viewBox="0 0 82.75 82.75"
                        >
                          <path
                            d="m64.89,0H17.86C8.04,0,0,8.04,0,17.86v47.04c0,9.82,8.04,17.86,17.86,17.86h47.04c9.82,0,17.86-8.04,17.86-17.86V17.86c0-9.82-8.04-17.86-17.86-17.86Zm-11.95,10.53s-.55,4.73,3.5,9.37l.06.06c-1.1-.71-2.11-1.57-2.99-2.52-2.22-2.54-3.06-5.11-3.37-6.91h2.79ZM14.9,60.48l.2.56c-.02-.06-.1-.26-.2-.56Zm52.09-25.81s-3.56-.15-6.21-.85c-3.69-.98-6.05-2.49-6.05-2.49,0,0-1.64-1.08-1.76-1.15v20.7c0,1.15-.31,4.03-1.23,6.43-1.2,3.14-3.06,5.21-3.41,5.62,0,0-2.27,2.79-6.25,4.67-3.59,1.69-6.75,1.65-7.69,1.69,0,0-5.45.22-10.36-3.1-1.05-.73-2.03-1.55-2.93-2.46,0,0,0,0,0,0l-.02-.02c-.51-.53-1-1.08-1.46-1.65-1.57-2-2.52-4.35-2.77-5.02h0c-.39-1.18-1.2-3.99-1.09-6.7.2-4.79,1.81-7.74,2.24-8.48,1.13-2.01,2.61-3.81,4.35-5.32,1.54-1.3,3.3-2.34,5.17-3.06,2.03-.86,4.21-1.31,6.42-1.35h0c.98-.01,1.96.05,2.93.2v10.23s-4.03-1.34-7.26,1.03c-2.25,1.75-3.45,3.45-3.81,6.5-.01,1.65.28,3.81,1.65,5.67,0,0,.01,0,.02.01.53.71,1.16,1.34,1.9,1.85,2.95,1.95,5.41,2.08,8.58.82,2.11-.85,3.69-2.74,4.42-4.86.47-1.32.45-2.65.45-4.02V10.53h7.35c.31,1.8,1.14,4.37,3.37,6.91.89.96,1.9,1.81,2.99,2.52.32.36,1.97,2.07,4.1,3.14,1.09.55,2.25.97,3.44,1.25h0c1.23.29,2.27.37,2.94.29v10.02Z"
                            fill="currentColor"
                          />
                        </svg>
                      </a>
                    </li>
                  ) : (
                    ''
                  )}
                  {person.twitchUrl ? (
                    <li>
                      <a
                        href={person.twitchUrl}
                        className="text-gray-400 hover:text-gray-300"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="sr-only">twitch</span>
                        <svg
                          className="h-5 w-5"
                          aria-hidden="true"
                          fill="currentColor"
                          viewBox="0 0 82.75 82.75"
                        >
                          <path
                            d="m19.35,26.02v32.44h11.15v6.1h6.08l6.08-6.1h9.13l12.16-12.16v-28.39H22.38l-3.03,8.12Zm7.09-4.06h33.46v22.31l-7.11,7.09h-11.15l-6.08,6.08v-6.08h-9.13v-29.4Z"
                            fill="none"
                          />
                          <rect
                            x="48.74"
                            y="30.08"
                            width="4.06"
                            height="12.18"
                            fill="none"
                          />
                          <rect
                            x="37.59"
                            y="30.08"
                            width="4.06"
                            height="12.16"
                            fill="none"
                          />
                          <path
                            d="m35.57,57.45l6.08-6.08h11.15l7.11-7.09v-22.31H26.44v29.4h9.13v6.08Zm13.17-27.37h4.06v12.18h-4.06v-12.18Zm-11.15,0h4.06v12.16h-4.06v-12.16Z"
                            fill="currentColor"
                          />
                          <path
                            d="m64.89,0H17.86C8.04,0,0,8.04,0,17.86v47.04c0,9.82,8.04,17.86,17.86,17.86h47.04c9.82,0,17.86-8.04,17.86-17.86V17.86c0-9.82-8.04-17.86-17.86-17.86Zm-.95,46.3l-12.16,12.16h-9.13l-6.08,6.1h-6.08v-6.1h-11.15V26.02l3.03-8.12h41.56v28.39Z"
                            fill="currentColor"
                          />
                        </svg>
                      </a>
                    </li>
                  ) : (
                    ''
                  )}
                  {person.whatsappUrl ? (
                    <li>
                      <a
                        href={person.whatsappUrl}
                        className="text-gray-400 hover:text-gray-300"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="sr-only">whatsapp</span>
                        <svg
                          className="h-5 w-5"
                          aria-hidden="true"
                          fill="currentColor"
                          viewBox="0 0 82.75 82.75"
                        >
                          <path
                            d="m64.89,0H17.86C8.04,0,0,8.04,0,17.86v47.04c0,9.82,8.04,17.86,17.86,17.86h47.04c9.82,0,17.86-8.04,17.86-17.86V17.86c0-9.82-8.04-17.86-17.86-17.86Zm-22.72,66.33c-4.45,0-8.86-1.13-12.74-3.28l-.15-.09-14.22,4.55,4.63-13.77-.1-.16c-2.47-4.1-3.78-8.8-3.78-13.61,0-14.53,11.82-26.35,26.35-26.35s26.35,11.82,26.35,26.35-11.82,26.35-26.35,26.35Z"
                            fill="currentColor"
                          />
                          <path
                            d="m42.17,17.29c-12.51,0-22.69,10.18-22.69,22.69,0,4.74,1.45,9.28,4.2,13.13l-2.97,8.84,9.14-2.93c3.68,2.39,7.93,3.65,12.32,3.65,12.51,0,22.69-10.18,22.69-22.69s-10.18-22.69-22.69-22.69Zm-8.98,9.91h0s0,0,0,0Zm21.91,22.79c-.57,1.42-3.28,2.76-4.38,2.82-.24.01-.43.05-.64.09-.82.17-1.76.36-7.31-2.08-4-1.75-7.9-5.44-10.96-10.38-.07-.12-.12-.2-.15-.24-.6-.87-2.56-3.93-2.45-6.91.11-2.99,1.62-4.48,2.35-5.2l.14-.14c.58-.59,1.21-.67,1.49-.67.02,0,.04,0,.05,0,.22,0,.44.03.65.05.23.02.45.05.66.05.06,0,.11,0,.18,0,.3-.01.59-.02.95.93l.64,1.73c.69,1.87,1.18,3.21,1.29,3.44.16.35.16.58.03.83l-.11.2c-.18.33-.29.54-.56.83-.13.14-.26.28-.39.43-.23.26-.46.52-.66.71-.34.31-.97.89-.44,1.87.47.88,1.76,3.11,3.7,4.97,2.16,2.08,4.1,3,5.03,3.45.18.08.32.15.42.21.55.3,1.28.55,1.98-.19.02-.02,1.71-1.83,2.29-2.63.3-.41.47-.39,1.07-.14.58.23,3.78,1.96,4.54,2.38l.37.2c.36.19.68.36.74.48.08.22.05,1.44-.54,2.89Z"
                            fill="currentColor"
                          />{' '}
                        </svg>
                      </a>
                    </li>
                  ) : (
                    ''
                  )}
                  {person.email ? (
                    <li>
                      <a
                        href={`mailto:${person.email}`}
                        className="text-gray-400 hover:text-gray-300"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="sr-only">Correo Electrónico</span>
                        <svg
                          className="h-5 w-5"
                          aria-hidden="true"
                          fill="currentColor"
                          viewBox="0 0 82.75 82.75"
                        >
                          <path
                            d="m64.89,0H17.86C8.04,0,0,8.04,0,17.86v47.04c0,9.82,8.04,17.86,17.86,17.86h47.04c9.82,0,17.86-8.04,17.86-17.86V17.86c0-9.82-8.04-17.86-17.86-17.86ZM18.38,22.89h46.51c.68,0,1.31.26,1.83.69l-25.08,21.47-25.08-21.47c.52-.43,1.15-.69,1.83-.69Zm-3.15,32.93v-28.87l15.02,12.86-14.92,16.87c-.06-.28-.1-.56-.1-.86Zm49.66,3.62H18.38c-.28,0-.55-.06-.81-.14l15.26-17.28,8.81,7.54,8.81-7.54,15.26,17.28c-.26.08-.53.14-.81.14Zm3.15-3.62c0,.3-.04.58-.1.86l-14.92-16.87,15.02-12.86v28.87Z"
                            fill="currentColor"
                          />
                        </svg>
                      </a>
                    </li>
                  ) : (
                    ''
                  )}
                  {person.websiteUrl ? (
                    <li>
                      <a
                        href={person.websiteUrl}
                        className="text-gray-400 hover:text-gray-300"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="sr-only">Sitio Web</span>
                        <svg
                          className="h-5 w-5"
                          aria-hidden="true"
                          fill="currentColor"
                          viewBox="0 0 82.75 82.75"
                        >
                          <path
                            d="m28.8,41.38c0-1.73.11-3.42.32-5.04h-6.36c-.44,1.61-.68,3.3-.68,5.04,0,1.99.31,3.91.87,5.71h6.25c-.26-1.83-.41-3.74-.41-5.71Z"
                            fill="currentColor"
                          />
                          <path
                            d="m24.37,50.44c2,3.7,5.17,6.66,9.02,8.39-1.52-2.23-2.74-5.1-3.54-8.39h-5.48Z"
                            fill="currentColor"
                          />
                          <path
                            d="m39.65,60.16v-9.72h-6.32c1.39,5.04,3.83,8.62,6.32,9.72Z"
                            fill="currentColor"
                          />
                          <path
                            d="m33.39,23.92c-4.08,1.83-7.4,5.05-9.36,9.06h5.67c.79-3.57,2.07-6.67,3.69-9.06Z"
                            fill="currentColor"
                          />
                          <path
                            d="m49.36,23.92c1.62,2.39,2.9,5.5,3.69,9.06h5.67c-1.96-4.01-5.29-7.23-9.36-9.06Z"
                            fill="currentColor"
                          />
                          <path
                            d="m53.95,41.38c0,1.97-.14,3.88-.41,5.71h6.25c.57-1.8.87-3.72.87-5.71,0-1.74-.24-3.43-.68-5.04h-6.36c.2,1.62.32,3.3.32,5.04Z"
                            fill="currentColor"
                          />
                          <path
                            d="m49.36,58.83c3.85-1.73,7.02-4.69,9.02-8.39h-5.48c-.8,3.29-2.02,6.16-3.54,8.39Z"
                            fill="currentColor"
                          />
                          <path
                            d="m64.89,0H17.86C8.04,0,0,8.04,0,17.86v47.04c0,9.82,8.04,17.86,17.86,17.86h47.04c9.82,0,17.86-8.04,17.86-17.86V17.86c0-9.82-8.04-17.86-17.86-17.86Zm-2.54,49.91v.54h-.23c-3.49,7.91-11.4,13.44-20.6,13.44h-.3c-9.2,0-17.11-5.52-20.6-13.44h-.23v-.54c-1.08-2.63-1.68-5.51-1.68-8.53,0-12.43,10.07-22.51,22.51-22.51h.3c12.43,0,22.51,10.08,22.51,22.51,0,3.02-.6,5.9-1.68,8.53Z"
                            fill="currentColor"
                          />
                          <path
                            d="m32.16,41.38c0,2,.16,3.92.45,5.71h7.04v-10.75h-7.15c-.22,1.59-.35,3.28-.35,5.04Z"
                            fill="currentColor"
                          />
                          <path
                            d="m42.78,50.44v9.85c2.6-.92,5.19-4.59,6.64-9.85h-6.64Z"
                            fill="currentColor"
                          />
                          <path
                            d="m50.59,41.38c0-1.76-.13-3.45-.35-5.04h-7.47v10.75h7.37c.29-1.79.45-3.71.45-5.71Z"
                            fill="currentColor"
                          />
                          <path
                            d="m33.16,32.98h6.49v-10.4c-2.6,1.15-5.14,5-6.49,10.4Z"
                            fill="currentColor"
                          />
                          <path
                            d="m42.78,22.46v10.52h6.82c-1.41-5.62-4.11-9.57-6.82-10.52Z"
                            fill="currentColor"
                          />
                        </svg>
                      </a>
                    </li>
                  ) : (
                    ''
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-6 xl:space-y-10"></div>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">
              Nombre Completo
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              <span className="mr-2 mt-2 inline-block shrink-0 rounded border bg-gray-200 px-2 py-0.5 text-sm font-medium text-gray-600">
                {person.fullName}
              </span>
            </dd>
          </div>

          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">
              Correo Electrónico
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              <span className="mr-2 mt-2 inline-block shrink-0 rounded border bg-gray-200 px-2 py-0.5 text-sm font-medium text-gray-600">
                {person.email}
              </span>
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Teléfono</dt>
            <dd className="mt-1 text-sm text-gray-900">
              <span className="mr-2 mt-2 inline-block shrink-0 rounded border bg-gray-200 px-2 py-0.5 text-sm font-medium text-gray-600">
                {person.phone}
              </span>
            </dd>
          </div>

          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">
              Rol de Sistema
            </dt>

            <dd className="mt-1 text-sm text-gray-900">
              {person.roles ? (
                <>
                  <h3 className="text-uta-tertiary">
                    {person.roles.map((element) => {
                      return (
                        <span
                          key={element.id}
                          className="mr-2 mt-2 inline-block shrink-0 rounded border bg-gray-200 px-2 py-0.5 text-sm font-medium text-gray-600 "
                        >
                          {element.name}
                        </span>
                      );
                    })}
                  </h3>
                  <p className="mt-2 text-white">
                    Área de Tecnología Educativa, Dirección de Docencia, Sede
                    Arica
                  </p>
                </>
              ) : (
                ''
              )}
            </dd>
          </div>

          <div className="sm:col-span-1"></div>
        </dl>
      </div>
    </div>
  );
}
