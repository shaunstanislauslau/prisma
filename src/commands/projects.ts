import { SystemEnvironment } from '../types'
import { fetchProjects } from '../api/api'
import figures = require('figures')
import {couldNotFetchProjectsMessage, graphcoolProjectFileName} from '../utils/constants'
import { readProjectIdFromProjectFile } from '../utils/file'

const {table, getBorderCharacters} = require('table')
const debug = require('debug')('graphcool')

interface Props {

}

export default async (props: Props, env: SystemEnvironment): Promise<void> => {

  const {resolver, out} = env

  try {
    const projects = await fetchProjects(resolver)
    const currentProjectId = readProjectIdFromProjectFile(resolver, graphcoolProjectFileName)

    const data = projects.map(p => {
      const isCurrentProject = currentProjectId === p.projectId || currentProjectId === p.alias
      return [isCurrentProject ? '*' : ' ', `${p.alias || p.projectId}   `, p.name]
    })

    const output = table(data, {
      border: getBorderCharacters('void'),
      columnDefault: {
        paddingLeft: '0',
        paddingRight: '1',
      },
      drawHorizontalLine: () => false,
    }).trimRight()

    out.write(output)
  } catch (e) {
    throw new Error(`${couldNotFetchProjectsMessage} ${e.message}`)
  }

}