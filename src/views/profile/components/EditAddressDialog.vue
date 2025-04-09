<template>
  <Dialog 
    :visible="modelValue"
    @update:visible="emit('update:modelValue', $event)"
    modal 
    header="Editar Endereço" 
    :style="{ width: '50vw' }"
    :breakpoints="{ '960px': '75vw', '641px': '90vw' }"
  >
    <div class="grid p-fluid">
      <div class="col-12 md:col-4 field">
        <label class="font-bold">CEP</label>
        <InputMask 
          v-model="form.zipcode" 
          mask="99999-999"
          placeholder="00000-000"
          @blur="searchCep"
        />
        <small v-if="v$.zipcode.$error" class="p-error">
          {{ v$.zipcode.$errors[0].$message }}
        </small>
      </div>

      <div class="col-12 md:col-8 field">
        <label class="font-bold">Rua</label>
        <InputText v-model="form.street" />
        <small v-if="v$.street.$error" class="p-error">
          {{ v$.street.$errors[0].$message }}
        </small>
      </div>

      <div class="col-12 md:col-4 field">
        <label class="font-bold">Número</label>
        <InputText v-model="form.number" />
      </div>

      <div class="col-12 md:col-8 field">
        <label class="font-bold">Bairro</label>
        <InputText v-model="form.neighborhood" />
        <small v-if="v$.neighborhood.$error" class="p-error">
          {{ v$.neighborhood.$errors[0].$message }}
        </small>
      </div>

      <div class="col-12 md:col-8 field">
        <label class="font-bold">Cidade</label>
        <InputText v-model="form.city" />
        <small v-if="v$.city.$error" class="p-error">
          {{ v$.city.$errors[0].$message }}
        </small>
      </div>

      <div class="col-12 md:col-4 field">
        <label class="font-bold">Estado</label>
        <Dropdown 
          v-model="form.state" 
          :options="states" 
          optionLabel="name" 
          optionValue="value" 
          placeholder="Selecione" 
        />
        <small v-if="v$.state.$error" class="p-error">
          {{ v$.state.$errors[0].$message }}
        </small>
      </div>
    </div>

    <template #footer>
      <Button label="Cancelar" icon="pi pi-times" @click="onCancel" class="p-button-text" />
      <Button label="Salvar" icon="pi pi-check" @click="onSave" :loading="loading" />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import Dialog from 'primevue/dialog'
import InputMask from 'primevue/inputmask'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import type { ValidationRule, ValidationRuleWithParams } from '@vuelidate/core'
import useVuelidate from '@vuelidate/core'
import { required, maxLength } from '@vuelidate/validators'
import type { AddressForm } from '@/types/profile'
import { addressService } from '@/services/addressService'

interface Props {
  modelValue: boolean
  initialData?: AddressForm | null
}

const props = withDefaults(defineProps<Props>(), {
  initialData: null
})

const emit = defineEmits(['update:modelValue', 'save'])

const loading = ref(false)
const form = reactive<AddressForm>({
  zipcode: '',
  street: '',
  number: '',
  neighborhood: '',
  city: '',
  state: '',
  uf: ''
})

const rules = {
  zipcode: { required },
  street: { required },
  number: { required },
  neighborhood: { required },
  city: { required },
  state: { required }
} satisfies { 
  [K in keyof AddressForm]: { [key: string]: ValidationRule | ValidationRuleWithParams } 
}

const v$ = useVuelidate(rules, form)

const states = [
  { name: 'Acre', value: 'AC' },
  { name: 'Alagoas', value: 'AL' },
  { name: 'Amapá', value: 'AP' },
  { name: 'Amazonas', value: 'AM' },
  { name: 'Bahia', value: 'BA' },
  { name: 'Ceará', value: 'CE' },
  { name: 'Distrito Federal', value: 'DF' },
  { name: 'Espírito Santo', value: 'ES' },
  { name: 'Goiás', value: 'GO' },
  { name: 'Maranhão', value: 'MA' },
  { name: 'Mato Grosso do Sul', value: 'MS' },
  { name: 'Mato Grosso', value: 'MT' },
  { name: 'Minas Gerais', value: 'MG' },
  { name: 'Pará', value: 'PA' },
  { name: 'Paraíba', value: 'PB' },
  { name: 'Paraná', value: 'PR' },
  { name: 'Pernambuco', value: 'PE' },
  { name: 'Piauí', value: 'PI' },
  { name: 'Rio de Janeiro', value: 'RJ' },
  { name: 'Rio Grande do Norte', value: 'RN' },
  { name: 'Rio Grande do Sul', value: 'RS' },
  { name: 'Rio Verde do Sul', value: 'RR' },
  { name: 'Santa Catarina', value: 'SC' },
  { name: 'São Paulo', value: 'SP' },
  { name: 'Sergipe', value: 'SE' },
  { name: 'Tocantins', value: 'TO' }
]

watch(() => props.initialData, (newValue) => {
  if (newValue) {
    Object.assign(form, newValue)
    if (newValue.uf) {
      form.state = newValue.uf
    }
  }
}, { immediate: true })

const searchCep = async () => {
  if (form.zipcode.length === 9) {
    try {
      loading.value = true
      const response = await fetch(`https://viacep.com.br/ws/${form.zipcode.replace('-', '')}/json/`)
      const data = await response.json()
      
      if (!data.erro) {
        form.street = data.logradouro
        form.neighborhood = data.bairro
        form.city = data.localidade
        form.state = data.uf
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error)
    } finally {
      loading.value = false
    }
  }
}

const onCancel = () => {
  emit('update:modelValue', false)
  v$.value.$reset()
}

const onSave = async () => {
  const isValid = await v$.value.$validate()
  if (!isValid) return

  try {
    loading.value = true
    const response = await addressService.updateAddress({ ...form })
    emit('update:modelValue', false)
    emit('save', response.data)
  } catch (error) {
    console.error('Error saving address:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
:deep(.p-dialog-content) {
  padding: 2rem;
}

.p-fluid .p-inputtext {
  width: 100%;
}

:deep(.p-dropdown) {
  width: 100%;
  display: block;
}

.field {
  display: flex;
  flex-direction: column;
}

.field label {
  margin-bottom: 0.5rem;
}
</style>
