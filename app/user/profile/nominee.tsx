'use client'

import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import {
  fetchNomineeData,
  updateNomineeData,
} from '../../../store/slices/nomineeslice'
import { RootState } from '../../../store/store'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast' // ✅ react-hot-toast

const NomineeComponent = () => {
  const dispatch = useAppDispatch()
  const { data, isLoading, error } = useAppSelector(
    (state: RootState) => state.nominee,
  )

  const [name, setName] = useState('')
  const [pan, setPan] = useState('')
  const [relationship, setRelationship] = useState('')
  const [initialValues, setInitialValues] = useState({
    nominee_name: '',
    nominee_pan: '',
    nominee_relationship: '',
  })

  useEffect(() => {
    dispatch(fetchNomineeData())
  }, [dispatch])

  useEffect(() => {
    if (data) {
      const nominee_name = data.name || ''
      const nominee_pan = data.pan || ''
      const nominee_relationship = data.relationship || ''

      setName(nominee_name)
      setPan(nominee_pan)
      setRelationship(nominee_relationship)
      setInitialValues({ nominee_name, nominee_pan, nominee_relationship })
    }
  }, [data])

  const isValidPAN = (pan: string) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(pan)

  const hasChanges =
    name !== initialValues.nominee_name ||
    pan !== initialValues.nominee_pan ||
    relationship !== initialValues.nominee_relationship

  const handleUpdateNominee = () => {
    if (!name || !pan || !relationship) {
      toast.error('All fields are required!')
      return
    }

    if (!isValidPAN(pan)) {
      toast.error('Invalid PAN format. Example: ABCDE1234F')
      return
    }

    toast.promise(
      dispatch(
        updateNomineeData({
          nominee_name: name,
          nominee_pan: pan.toUpperCase(),
          nominee_relationship: relationship,
        }),
      ).then((action) => {
        if (action.meta.requestStatus === 'fulfilled') {
          setInitialValues({
            nominee_name: name,
            nominee_pan: pan.toUpperCase(),
            nominee_relationship: relationship,
          })
          dispatch(fetchNomineeData()) // Re-fetch to sync
        } else {
          throw new Error()
        }
      }),
      {
        loading: 'Updating nominee...',
        success: 'Nominee updated successfully!',
        error: 'Failed to update nominee',
      },
    )
  }

  return (
    <div className="space-y-4">
      {isLoading && <p>Loading nominee data...</p>}
      {error === 'No nominee found' ? (
        <p className="text-gray-600 italic">No nominee found.</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : null}

      <div className="space-y-2">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Nominee Full Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full"
          placeholder="Nominee Full Name"
        />

        <label
          htmlFor="pan"
          className="block text-sm font-medium text-gray-700"
        >
          Nominee's PAN/Number
        </label>
        <input
          id="pan"
          type="text"
          value={pan}
          onChange={(e) => setPan(e.target.value.toUpperCase())}
          className="p-2 border border-gray-300 rounded-md w-full"
          placeholder="ABCDE1234F"
        />

        <label
          htmlFor="relationship"
          className="block text-sm font-medium text-gray-700"
        >
          Relationship
        </label>
        <select
          id="relationship"
          value={relationship}
          onChange={(e) => setRelationship(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full"
        >
          <option value="">Select Relationship</option>
          <option value="father">Father</option>
          <option value="mother">Mother</option>
          <option value="husband">Husband</option>
          <option value="wife">Wife</option>
          <option value="son">Son</option>
          <option value="daughter">Daughter</option>
          <option value="others">Others</option>
        </select>

        <Button
          onClick={handleUpdateNominee}
          className="bg-red-600 hover:bg-red-700  text-white mt-2"
          disabled={!hasChanges}
        >
          Update Nominee
        </Button>
      </div>
    </div>
  )
}

export default NomineeComponent
