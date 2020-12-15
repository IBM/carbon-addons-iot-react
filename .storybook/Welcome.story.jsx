import React from 'react';
import union from 'lodash/union';

import styles from './welcome-story.css';

import {
  Accordion,
  AccordionItem,
  StructuredListWrapper,
  StructuredListHead,
  StructuredListBody,
  StructuredListRow,
  StructuredListCell,
} from '../src/index';

const carbonExports = Object.keys(require('carbon-components-react'));
const iotAddonsExports = Object.keys(require('../src/index'));

export default {
  title: '0/Getting Started',
};

export const AboutStorybook = () => (
  <div className="storybook-welcome">
    <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMzAiIGhlaWdodD0iNTkiPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjEwMCUiIHgyPSIwJSIgeTE9IjAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzQwOEJGQyIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI0JCOEVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0ibm9uemVybyI+PHBhdGggZmlsbD0idXJsKCNhKSIgZD0iTTQyLjczNyAyNy40NnYzLjA1M2gtNi4xMDV2NC41NzlhMy4wNTcgMy4wNTcgMCAwIDEtMy4wNTMgMy4wNTNIMjl2Ni4xMDVoLTMuMDUydi02LjEwNUgxNi43OXY2LjEwNWgtMy4wNTN2LTYuMTA1SDkuMTU4YTMuMDU2IDMuMDU2IDAgMCAxLTMuMDUzLTMuMDUzdi00LjU3OUgwVjI3LjQ2aDYuMTA1di05LjE1OEgwVjE1LjI1aDYuMTA1di00LjU4YTMuMDU2IDMuMDU2IDAgMCAxIDMuMDUzLTMuMDUyaDQuNTc5VjEuNTEzaDMuMDUzdjYuMTA1aDYuMTA1djMuMDUxbC0xMy43MzcuMDAydjI0LjQyMWgyNC40MjFWMjEuMzU1aDMuMDUzdjYuMTA1aDYuMTA1ek0yOC45OTYgMzAuNTFIMTMuNzRWMTUuMjU0aDE1LjI1NVYzMC41MXptLTEyLjIwNC0zLjA1MWg5LjE1M3YtOS4xNTNoLTkuMTUzdjkuMTUzek00NC4yNSAxOC4yOGgtMy4wNDdDNDEuMTkzIDkuODcgMzQuMzggMy4wNTYgMjUuOTcgMy4wNDdWMEMzNi4wNjEuMDExIDQ0LjI0IDguMTg5IDQ0LjI1IDE4LjI4em0tNy42MjcgMGgtMy4wNDRhNy42MTggNy42MTggMCAwIDAtNy42MDktNy42MVY3LjYyOGM1Ljg4LjAwNyAxMC42NDYgNC43NzMgMTAuNjUzIDEwLjY1M3oiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQzLjI4KSIvPjxwYXRoIGZpbGw9IiMwMDAiIGQ9Ik0zLjAzOSA1OC4xM2MtMS4zOTIgMC0yLjItMS4wMDYtMi4yLTIuNTM5IDAtMS41NDEuODE4LTIuNTM4IDIuMTktMi41MzguOTQgMCAxLjUyMy40NiAxLjc5NiAxLjExOWwtLjYwMi4zMmMtLjE3OC0uNDk5LS41OTItLjc5LTEuMTk0LS43OS0uODgzIDAtMS4zODIuNjItMS4zODIgMS40NzZ2LjgyN2MwIC44NTUuNDkgMS40NzYgMS40MDEgMS40NzYuNjQ5IDAgMS4wNzItLjMyIDEuMzE2LS44NDZMNC45IDU3Yy0uMjgyLjY0OS0uODkzIDEuMTI4LTEuODYxIDEuMTI4em03LjgyMS0uMTEzaC0uNTE3Yy0uNTgzIDAtLjgwOC0uMzM5LS44NjUtLjc5aC0uMDQ3Yy0uMjA3LjU1NS0uNjY3LjkwMi0xLjQ1Ny45MDItMS4wMTUgMC0xLjY2NC0uNTY0LTEuNjY0LTEuNDc1IDAtLjg5My42My0xLjQxIDIuMDg3LTEuNDFoMS4wMzR2LS40OGMwLS43MDUtLjQyMy0xLjA3Mi0xLjE1Ni0xLjA3Mi0uNjQ5IDAtMS4wNDQuMjczLTEuMjk3LjcxNWwtLjUwOC0uMzc2Yy4yNDQtLjUwOC44NjUtLjk3OCAxLjg1Mi0uOTc4IDEuMTM3IDAgMS44NjEuNjExIDEuODYxIDEuNjM2djIuNjdoLjY3N3YuNjU4ek04LjEwNiA1Ny41Yy43NyAwIDEuMzI1LS4zOTUgMS4zMjUtLjg5M3YtLjhIOC4zOTdjLS44OTMgMC0xLjI5Ny4yNjQtMS4yOTcuNzM0di4xOTdjMCAuNDk4LjM4NS43NjIgMS4wMDYuNzYyem0zLjk0OC41MTd2LS42NGgxLjQydi0zLjU3MmgtMS40MnYtLjY0aDIuMTcydjEuMjIzaC4wNDdjLjE4OC0uNjQuNjItMS4yMjIgMS42MzUtMS4yMjJoLjY3N3YuNzUyaC0uOTEyYy0uOTUgMC0xLjQ0Ny42MTEtMS40NDcgMS4zNjN2Mi4wOTZoMS44OHYuNjRoLTQuMDUyem01LjgxIDBWNTEuMDZoLjc1MnYyLjg5NmguMDM3Yy4zMS0uNTkzLjgxOC0uOTAzIDEuNDk1LS45MDMgMS4xODQgMCAxLjg5OS45NSAxLjg5OSAyLjUzOCAwIDEuNTg5LS43MTUgMi41MzgtMS44OTkgMi41MzgtLjY3NyAwLTEuMTg0LS4zMS0xLjQ5NS0uOTAyaC0uMDM3di43OWgtLjc1MnptMS45OTMtLjU1NWMuODc0IDAgMS4zODEtLjU4MyAxLjM4MS0xLjQ1N3YtLjgyN2MwLS44NzUtLjUwNy0xLjQ1Ny0xLjM4MS0xLjQ1Ny0uNjY4IDAtMS4yNDEuMzQ3LTEuMjQxLjk5NnYxLjc0OWMwIC42NDguNTczLjk5NiAxLjI0Ljk5NnptNS41NzQuNjY3Yy0xLjM2MyAwLTIuMi0uOTk2LTIuMi0yLjUzOCAwLTEuNTQxLjgzNy0yLjUzOCAyLjItMi41MzggMS4zNjMgMCAyLjIuOTk3IDIuMiAyLjUzOCAwIDEuNTQyLS44MzcgMi41MzgtMi4yIDIuNTM4em0wLS42NDhjLjgzNyAwIDEuNC0uNDk4IDEuNC0xLjU0MnYtLjY5NmMwLTEuMDQzLS41NjMtMS41NDEtMS40LTEuNTQxLS44MzYgMC0xLjQuNDk4LTEuNCAxLjU0MXYuNjk2YzAgMS4wNDQuNTY0IDEuNTQyIDEuNCAxLjU0MnptNC40OTQuNTM2aC0uNzUydi00Ljg1MWguNzUydi43OWguMDM3Yy4yMDctLjQ4LjU4My0uOTAzIDEuMzgyLS45MDMgMS4wMTUgMCAxLjY4My42NzcgMS42ODMgMS44NTJ2My4xMTJoLS43NTJ2LTIuOThjMC0uODg0LS40MDQtMS4zMTYtMS4xNDctMS4zMTYtLjYwMiAwLTEuMjAzLjI5MS0xLjIwMy45M3YzLjM2NnptOC4xNS0yLjQ2M0gzNS4zNXYtLjc5aDIuNzI2di43OXptNi42MjggMi40NjNoLS41MTdjLS41ODMgMC0uODA5LS4zMzktLjg2NS0uNzloLS4wNDdjLS4yMDcuNTU1LS42NjguOTAyLTEuNDU3LjkwMi0xLjAxNiAwLTEuNjY0LS41NjQtMS42NjQtMS40NzUgMC0uODkzLjYzLTEuNDEgMi4wODctMS40MWgxLjAzNHYtLjQ4YzAtLjcwNS0uNDIzLTEuMDcyLTEuMTU3LTEuMDcyLS42NDggMC0xLjA0My4yNzMtMS4yOTcuNzE1bC0uNTA4LS4zNzZjLjI0NS0uNTA4Ljg2NS0uOTc4IDEuODUyLS45NzggMS4xMzggMCAxLjg2Mi42MTEgMS44NjIgMS42MzZ2Mi42N2guNjc3di42NTh6bS0yLjc1NS0uNTE3Yy43NzEgMCAxLjMyNi0uMzk1IDEuMzI2LS44OTN2LS44SDQyLjI0Yy0uODkzIDAtMS4yOTguMjY0LTEuMjk4LjczNHYuMTk3YzAgLjQ5OC4zODYuNzYyIDEuMDA2Ljc2MnptNy4yMi41MTd2LS43OWgtLjAzOGMtLjMxLjU5Mi0uODE4LjkwMi0xLjQ5NC45MDItMS4xODUgMC0xLjktLjk0OS0xLjktMi41MzggMC0xLjU4OC43MTUtMi41MzggMS45LTIuNTM4LjY3NiAwIDEuMTg0LjMxIDEuNDk0LjkwM2guMDM4VjUxLjA2aC43NTJ2Ni45NTdoLS43NTJ6bS0xLjI0MS0uNTU1Yy42NjcgMCAxLjI0LS4zNDggMS4yNC0uOTk2di0xLjc0OWMwLS42NDktLjU3My0uOTk2LTEuMjQtLjk5Ni0uODc0IDAtMS4zODIuNTgyLTEuMzgyIDEuNDU3di44MjdjMCAuODc0LjUwOCAxLjQ1NyAxLjM4MiAxLjQ1N3ptNi44ODEuNTU1di0uNzloLS4wMzdjLS4zMS41OTItLjgxOC45MDItMS40OTUuOTAyLTEuMTg1IDAtMS44OTktLjk0OS0xLjg5OS0yLjUzOCAwLTEuNTg4LjcxNC0yLjUzOCAxLjg5OS0yLjUzOC42NzcgMCAxLjE4NC4zMSAxLjQ5NS45MDNoLjAzN1Y1MS4wNmguNzUydjYuOTU3aC0uNzUyem0tMS4yNC0uNTU1Yy42NjcgMCAxLjI0LS4zNDggMS4yNC0uOTk2di0xLjc0OWMwLS42NDktLjU3My0uOTk2LTEuMjQtLjk5Ni0uODc1IDAtMS4zODMuNTgyLTEuMzgzIDEuNDU3di44MjdjMCAuODc0LjUwOCAxLjQ1NyAxLjM4MiAxLjQ1N3ptNS43MDYuNjY3Yy0xLjM2NCAwLTIuMi0uOTk2LTIuMi0yLjUzOCAwLTEuNTQxLjgzNi0yLjUzOCAyLjItMi41MzggMS4zNjMgMCAyLjIuOTk3IDIuMiAyLjUzOCAwIDEuNTQyLS44MzcgMi41MzgtMi4yIDIuNTM4em0wLS42NDhjLjgzNiAwIDEuNC0uNDk4IDEuNC0xLjU0MnYtLjY5NmMwLTEuMDQzLS41NjQtMS41NDEtMS40LTEuNTQxLS44MzcgMC0xLjQwMS40OTgtMS40MDEgMS41NDF2LjY5NmMwIDEuMDQ0LjU2NCAxLjU0MiAxLjQgMS41NDJ6bTQuNDkzLjUzNmgtLjc1MnYtNC44NTFoLjc1MnYuNzloLjAzOGMuMjA3LS40OC41ODMtLjkwMyAxLjM4Mi0uOTAzIDEuMDE1IDAgMS42ODIuNjc3IDEuNjgyIDEuODUydjMuMTEyaC0uNzUydi0yLjk4YzAtLjg4NC0uNDA0LTEuMzE2LTEuMTQ3LTEuMzE2LS42MDEgMC0xLjIwMy4yOTEtMS4yMDMuOTN2My4zNjZ6bTYuODQ0LjExMmMtMS4wMTUgMC0xLjc0LS4zNzYtMi4yNDctLjk0OWwuNTA4LS40NDJjLjQ2LjQ4OS45ODcuNzYyIDEuNzU4Ljc2Mi43NTIgMCAxLjI4Ny0uMjY0IDEuMjg3LS44MzcgMC0uNTA4LS40MTMtLjY0LS44NTUtLjcwNWwtLjc2MS0uMTEzYy0uNjg3LS4xMDMtMS42NjQtLjI5MS0xLjY2NC0xLjM0NCAwLS45NjguODI3LTEuNDQ4IDEuOTU1LTEuNDQ4Ljg3NCAwIDEuNTEzLjI5MiAxLjk3NC43OGwtLjQ4OS40NjFjLS4yMjUtLjI3My0uNjU4LS42MTEtMS41MTMtLjYxMS0uNzYyIDAtMS4xODUuMjczLTEuMTg1Ljc3IDAgLjUwOC40MjMuNjQuODU2LjcwNmwuNzYxLjExM2MuNjk2LjEwMyAxLjY2NC4yOTEgMS42NjQgMS4zNDQgMCAuOTU5LS44MDggMS41MTMtMi4wNSAxLjUxM3ptNi45NDctMi41NzVoLTIuNzI2di0uNzloMi43MjZ2Ljc5em00LjU3OC0zLjQ2Yy0uNDMyIDAtLjU5Mi0uMjA3LS41OTItLjQ4di0uMTVjMC0uMjcyLjE2LS40NzkuNTkyLS40NzkuNDMyIDAgLjU5Mi4yMDcuNTkyLjQ4di4xNWMwIC4yNzItLjE2LjQ4LS41OTIuNDh6bS0yLjEyNSA1LjkyM3YtLjY0aDEuNzQ5di0zLjU3MmgtMS43NDl2LS42NGgyLjUwMXY0LjIxMmgxLjYzNnYuNjRIODAuMDF6bTcuNDY1LjExMmMtMS4zNjQgMC0yLjItLjk5Ni0yLjItMi41MzggMC0xLjU0MS44MzYtMi41MzggMi4yLTIuNTM4IDEuMzYzIDAgMi4yLjk5NyAyLjIgMi41MzggMCAxLjU0Mi0uODM3IDIuNTM4LTIuMiAyLjUzOHptMC0uNjQ4Yy44MzYgMCAxLjQtLjQ5OCAxLjQtMS41NDJ2LS42OTZjMC0xLjA0My0uNTY0LTEuNTQxLTEuNC0xLjU0MS0uODM3IDAtMS40MDEuNDk4LTEuNDAxIDEuNTQxdi42OTZjMCAxLjA0NC41NjQgMS41NDIgMS40IDEuNTQyem03Ljc2NS41MzZoLTEuODljLS43MzMgMC0xLjA3Mi0uNDYxLTEuMDcyLTEuMTF2LTMuMTAyaC0xLjYxN3YtLjY0aDEuMjA0Yy4zMiAwIC40NDItLjExMi40NDItLjQ0di0xLjI3aC43MjN2MS43MWgyLjIxdi42NGgtMi4yMXYzLjU3MmgyLjIxdi42NHptNC44NzgtMi40NjNoLTIuNzI2di0uNzloMi43MjZ2Ljc5em0yLjE4MSAyLjQ2M3YtLjY0aDEuNDJ2LTMuNTcyaC0xLjQydi0uNjRoMi4xNzJ2MS4yMjNoLjA0N2MuMTg4LS42NC42Mi0xLjIyMiAxLjYzNi0xLjIyMmguNjc3di43NTJoLS45MTJjLS45NSAwLTEuNDQ4LjYxMS0xLjQ0OCAxLjM2M3YyLjA5NmgxLjg4di42NEgxMDIuM3ptNy44MjIuMTEyYy0xLjM5MiAwLTIuMjc1LS45OTYtMi4yNzUtMi41MjggMC0xLjU1MS45MTItMi41NDggMi4yMjgtMi41NDggMS4zMDYgMCAyLjE1My45OTcgMi4xNTMgMi4zN3YuMzU2aC0zLjU5MnYuMjI2YzAgLjg1NS41NzQgMS40NzYgMS40ODYgMS40NzYuNjQ4IDAgMS4xMzctLjMyIDEuMzkxLS44NDZsLjU1NS4zNzZjLS4yOTIuNjQ4LS45ODcgMS4xMTgtMS45NDYgMS4xMTh6bS0uMDQ3LTQuNDU1Yy0uODI3IDAtMS40MzkuNjMtMS40MzkgMS40NzV2LjA2NmgyLjc4M3YtLjEwM2MwLS44NTYtLjU0NS0xLjQzOC0xLjM0NC0xLjQzOHptNy45NTMgNC4zNDNoLS41MTdjLS41ODMgMC0uODA5LS4zMzktLjg2NS0uNzloLS4wNDdjLS4yMDcuNTU1LS42NjguOTAyLTEuNDU3LjkwMi0xLjAxNiAwLTEuNjY0LS41NjQtMS42NjQtMS40NzUgMC0uODkzLjYzLTEuNDEgMi4wODctMS40MWgxLjAzNHYtLjQ4YzAtLjcwNS0uNDIzLTEuMDcyLTEuMTU2LTEuMDcyLS42NSAwLTEuMDQ0LjI3My0xLjI5OC43MTVsLS41MDctLjM3NmMuMjQ0LS41MDguODY1LS45NzggMS44NTItLjk3OCAxLjEzNyAwIDEuODYuNjExIDEuODYgMS42MzZ2Mi42N2guNjc4di42NTh6bS0yLjc1NS0uNTE3Yy43NzEgMCAxLjMyNi0uMzk1IDEuMzI2LS44OTN2LS44aC0xLjAzNGMtLjg5MyAwLTEuMjk4LjI2NC0xLjI5OC43MzR2LjE5N2MwIC40OTguMzg2Ljc2MiAxLjAwNi43NjJ6bTYuMjE0LjYzYy0xLjM5MSAwLTIuMi0xLjAwNi0yLjItMi41MzkgMC0xLjU0MS44MTgtMi41MzggMi4xOS0yLjUzOC45NCAwIDEuNTI0LjQ2IDEuNzk2IDEuMTE5bC0uNjAxLjMyYy0uMTc5LS40OTktLjU5My0uNzktMS4xOTQtLjc5LS44ODQgMC0xLjM4Mi42Mi0xLjM4MiAxLjQ3NnYuODI3YzAgLjg1NS40ODkgMS40NzYgMS40IDEuNDc2LjY1IDAgMS4wNzItLjMyIDEuMzE3LS44NDZsLjUzNi4zNjZjLS4yODIuNjQ5LS44OTQgMS4xMjgtMS44NjIgMS4xMjh6bTcuNTk2LS4xMTNoLTEuODljLS43MzMgMC0xLjA3MS0uNDYxLTEuMDcxLTEuMTF2LTMuMTAyaC0xLjYxN3YtLjY0aDEuMjAzYy4zMiAwIC40NDItLjExMi40NDItLjQ0di0xLjI3aC43MjR2MS43MWgyLjIwOXYuNjRoLTIuMjF2My41NzJoMi4yMXYuNjR6Ii8+PC9nPjwvc3ZnPg==" />
    <p>
      Storybook is a development environment for UI components. It allows you to
      browse the component library, view the different states of each component,
      and interactively develop and test components.
    </p>
    <p>This storybook has 3 sections:</p>
    <p>
      <strong>Watson IoT</strong> - Components that are either extensions of
      Carbon components, or totally custom components not available in Carbon.
    </p>
    <p>
      <strong>Watson IoT Experimental</strong> - Similar to above, but these
      components are not yet finalized or stable. The APIs of these components
      may change rapidly and are not required to have associated tests,
      including snapshots.
    </p>
    <p>
      <strong>Carbon</strong> - Components imported from Carbon and re-exported
      with no modifications
    </p>
    <p>
      For additional guidance, see the{' '}
      <a href="https://ibm.biz/iot-design-site">Watson IoT Design Site</a>
    </p>
    <Accordion>
      <AccordionItem title={'Exports table'} open={false}>
        <p>
          The following table shows a comparison of exports from
          carbon-components-react and this library. These are primarily used for
          snapshot purposes to track and ensure that as the exports change
          upstream in Carbon we continue to provide parity with their package.
        </p>
        <StructuredListWrapper>
          <StructuredListHead>
            <StructuredListRow head>
              <StructuredListCell head>
                carbon-components-react exports
              </StructuredListCell>
              <StructuredListCell head>
                carbon-addons-iot-react exports
              </StructuredListCell>
            </StructuredListRow>
          </StructuredListHead>
          <StructuredListBody>
            {union(carbonExports, iotAddonsExports).map((item) => (
              <StructuredListRow key={item}>
                <StructuredListCell>
                  {carbonExports.includes(item) ? item : null}
                </StructuredListCell>
                <StructuredListCell>
                  {iotAddonsExports.includes(item) ? item : null}
                </StructuredListCell>
              </StructuredListRow>
            ))}
          </StructuredListBody>
        </StructuredListWrapper>
      </AccordionItem>
    </Accordion>
    <p className="netlify-link">
      <a href="https://www.netlify.com">This site is powered by Netlify</a>
    </p>
  </div>
);

AboutStorybook.story = {
  name: 'About Storybook',
};