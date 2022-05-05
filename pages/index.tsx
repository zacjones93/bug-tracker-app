import type { GetServerSideProps, GetStaticProps, NextPage } from 'next'
import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'

import { DragDropContext, Droppable, Draggable, resetServerContext } from 'react-beautiful-dnd';

const reorder = (list: any, startIndex: any, endIndex: any) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

function Bug({ bug, index }: {bug: any, index: any}) {
  return (
    <Draggable draggableId={bug.id} index={index}>
      {(provided: any) => (
        // width: 200px;
        // border: 1px solid grey;
        // margin-bottom: ${grid}px;
        // background-color: lightblue;
        // padding: ${grid}px;
        <div
          className='p-4 mb-4 bg-blue-100 border-blue-200 rounded w-52'
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {bug.content}
        </div>
      )}
    </Draggable>
  );
}

const BugList = ({bugs}: {bugs: any[]}) => {
  return (
  <div className='w-52'>
    {bugs ? bugs.map((bug: any, index: number) => (
        <Bug bug={bug} index={index} key={bug.id} />
    )) : null}
  </div>
  )
}


const Home: NextPage = (props) => {

  const inbox = Array.from({ length: 10 }, (v, k) => k).map(k => {
    const custom = {
      id: `id-${k}`,
      content: `Bug ${k}`
    };
  
    return custom;
  });

  const initialColumns = {
    inbox: {
      id: 'inbox',
      list: inbox
    },
    workingOn: {
      id: 'working',
      list: []
    },
    done: {
      id: 'done',
      list: []
    }
  }

  const [winReady, setwinReady] = useState(false);
  useEffect(() => {
      setwinReady(true);
  }, []);

  const [state, setState] = useState(initialColumns);

  
  
  function onDragEnd(result: any) {
    console.log({state})
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }
    
    if (result.destination.droppableId === result.source.droppableId) {
      let destinationColumn = state[result.destination.droppableId]
      const bugs = reorder(
        destinationColumn.list,
        result.source.index,
        result.destination.index
      );
      let newCol = {
        id: destinationColumn.id,
        list: bugs
      }

      console.log("my object", { 
        ...state,
        [destinationColumn.id]: {
          ...newCol
        }
      },
      "newCol: ", {newCol}
      )
      
      setState({ 
        ...state,
        [destinationColumn.id]: {
          ...newCol
        }
    });
    }

    console.log({state})
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center flex-1 w-full px-20 text-center bg-slate-500">
        {winReady ? <DragDropContext onDragEnd={onDragEnd}>
          <div className='gap-4'>
            <Droppable droppableId={state.inbox.id}>
              {(provided: any) => (
                <div ref={provided.innerRef} {...provided.droppableProps}
                  className="h-[60vh] p-4 overflow-scroll bg-slate-600 rounded-sm"
                >
                  {state ? <BugList bugs={state.inbox.list} /> : null}
                  
                  {provided.placeholder}
                </div>
              )}
            </Droppable>            
          </div>
          
          
        </DragDropContext> : null}
      </main>

    </div>
  )
}


export const getStaticProps: GetStaticProps = async () => {

  //resetServerContext()   // <-- CALL RESET SERVER CONTEXT, SERVER SIDE

  

  

  return {props: { data: [] }}

}

export default Home
