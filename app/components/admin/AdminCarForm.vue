<script setup lang="ts">
import AdminField from '~/components/admin/AdminField.vue'
import type { AdminCarPayload } from '~/types/car'

interface Dictionaries {
  brands: string[]
  models: string[]
  cities: string[]
  fuels: string[]
  transmissions: string[]
  drivetrains: string[]
  colors: string[]
}

const props = defineProps<{
  dictionaries: Dictionaries
}>()

const emit = defineEmits<{
  created: [id: string]
}>()

const isSubmitting = ref(false)
const errorMessage = ref('')
const imageText = ref('')
const { adminFetch } = useAdminApi()

const form = reactive<AdminCarPayload>({
  brand: '',
  model: '',
  title: '',
  price: 0,
  year: new Date().getFullYear(),
  mileage: 0,
  fuel: '',
  transmission: '',
  city: 'Бишкек',
  engine: '',
  drivetrain: '',
  power: 0,
  color: '',
  description: '',
  sellerName: '',
  sellerType: 'Дилер',
  sellerPhone: '+996 ',
  images: [],
  isFeatured: false
})

const normalizedImages = computed(() =>
  imageText.value
    .split('\n')
    .map((image) => image.trim())
    .filter(Boolean)
)

const submit = async () => {
  errorMessage.value = ''
  isSubmitting.value = true

  try {
    const response = await adminFetch<{ data: { id: string } }>('/api/admin/cars', {
      method: 'POST',
      body: {
        ...form,
        images: normalizedImages.value
      }
    })

    emit('created', response.data.id)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Не удалось сохранить автомобиль'
  } finally {
    isSubmitting.value = false
  }
}

const inputClass = 'focus-ring min-h-12 rounded-2xl border border-slate-200 bg-white px-4 text-base font-bold text-slate-950 placeholder:text-slate-400'
</script>

<template>
  <form class="grid gap-4" @submit.prevent="submit">
    <section class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 class="text-lg font-black">Автомобиль</h2>

      <div class="mt-4 grid gap-4">
        <AdminField label="Марка" hint="Можно выбрать существующую или ввести новую. Например: Mercedes-Benz.">
          <input v-model.trim="form.brand" :class="inputClass" list="admin-brands" placeholder="Toyota" required>
          <datalist id="admin-brands">
            <option v-for="brand in props.dictionaries.brands" :key="brand" :value="brand" />
          </datalist>
        </AdminField>

        <AdminField label="Модель">
          <input v-model.trim="form.model" :class="inputClass" list="admin-models" placeholder="Camry" required>
          <datalist id="admin-models">
            <option v-for="model in props.dictionaries.models" :key="model" :value="model" />
          </datalist>
        </AdminField>

        <AdminField label="Название объявления">
          <input v-model.trim="form.title" :class="inputClass" placeholder="Toyota Camry 70, 2.5 AT">
        </AdminField>

        <div class="grid grid-cols-2 gap-3">
          <AdminField label="Цена, $" >
            <input v-model.number="form.price" :class="inputClass" inputmode="numeric" min="1" required type="number">
          </AdminField>

          <AdminField label="Год">
            <input v-model.number="form.year" :class="inputClass" inputmode="numeric" min="1980" required type="number">
          </AdminField>
        </div>

        <AdminField label="Пробег, км">
          <input v-model.number="form.mileage" :class="inputClass" inputmode="numeric" min="0" type="number">
        </AdminField>
      </div>
    </section>

    <section class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 class="text-lg font-black">Характеристики</h2>

      <div class="mt-4 grid gap-4">
        <div class="grid grid-cols-2 gap-3">
          <AdminField label="Топливо">
            <input v-model.trim="form.fuel" :class="inputClass" list="admin-fuels" placeholder="Бензин">
            <datalist id="admin-fuels">
              <option v-for="fuel in props.dictionaries.fuels" :key="fuel" :value="fuel" />
            </datalist>
          </AdminField>

          <AdminField label="Коробка">
            <input v-model.trim="form.transmission" :class="inputClass" list="admin-transmissions" placeholder="Автомат">
            <datalist id="admin-transmissions">
              <option v-for="transmission in props.dictionaries.transmissions" :key="transmission" :value="transmission" />
            </datalist>
          </AdminField>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <AdminField label="Привод">
            <input v-model.trim="form.drivetrain" :class="inputClass" list="admin-drivetrains" placeholder="Передний">
            <datalist id="admin-drivetrains">
              <option v-for="drivetrain in props.dictionaries.drivetrains" :key="drivetrain" :value="drivetrain" />
            </datalist>
          </AdminField>

          <AdminField label="Мощность">
            <input v-model.number="form.power" :class="inputClass" inputmode="numeric" min="0" type="number">
          </AdminField>
        </div>

        <AdminField label="Двигатель">
          <input v-model.trim="form.engine" :class="inputClass" placeholder="2.5 л">
        </AdminField>

        <AdminField label="Цвет">
          <input v-model.trim="form.color" :class="inputClass" list="admin-colors" placeholder="Белый">
          <datalist id="admin-colors">
            <option v-for="color in props.dictionaries.colors" :key="color" :value="color" />
          </datalist>
        </AdminField>
      </div>
    </section>

    <section class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 class="text-lg font-black">Локация и продавец</h2>

      <div class="mt-4 grid gap-4">
        <AdminField label="Город">
          <input v-model.trim="form.city" :class="inputClass" list="admin-cities" required>
          <datalist id="admin-cities">
            <option v-for="city in props.dictionaries.cities" :key="city" :value="city" />
          </datalist>
        </AdminField>

        <AdminField label="Продавец">
          <input v-model.trim="form.sellerName" :class="inputClass" placeholder="Название дилера или имя" required>
        </AdminField>

        <AdminField label="Телефон">
          <input v-model.trim="form.sellerPhone" :class="inputClass" inputmode="tel" placeholder="+996 555 000 000" required>
        </AdminField>

        <label class="flex min-h-12 items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4 text-sm font-black text-slate-800">
          Лучшее предложение
          <input v-model="form.isFeatured" class="h-5 w-5 accent-emerald-600" type="checkbox">
        </label>
      </div>
    </section>

    <section class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 class="text-lg font-black">Описание и фото</h2>

      <div class="mt-4 grid gap-4">
        <AdminField label="Описание">
          <textarea v-model.trim="form.description" class="focus-ring min-h-32 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-semibold text-slate-950 placeholder:text-slate-400" placeholder="Кратко опишите состояние, комплектацию и историю." />
        </AdminField>

        <AdminField label="Фото URL" hint="Каждая ссылка с новой строки. Позже заменим на загрузку файлов.">
          <textarea v-model="imageText" class="focus-ring min-h-28 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-semibold text-slate-950 placeholder:text-slate-400" placeholder="https://..." />
        </AdminField>
      </div>
    </section>

    <p v-if="errorMessage" class="rounded-2xl bg-rose-50 p-4 text-sm font-bold text-rose-700">
      {{ errorMessage }}
    </p>

    <button
      class="focus-ring sticky bottom-4 min-h-14 rounded-2xl bg-emerald-600 px-5 text-base font-black text-white shadow-lg shadow-emerald-600/25 transition disabled:cursor-not-allowed disabled:opacity-60"
      :disabled="isSubmitting"
      type="submit"
    >
      {{ isSubmitting ? 'Сохраняем...' : 'Сохранить автомобиль' }}
    </button>
  </form>
</template>
